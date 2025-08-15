import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { FollowClient } from 'test/clients/follow.client';
import { FollowUseCase } from 'test/usecases/follow.usecase';
import { UserFactory } from 'test/factories/user.factory';
import { ApiErrorResponse, SupertestResponse } from 'test/types/api';

describe('FollowController (POST /follow)', () => {
  const prefix = 'follower_create';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should create a follow to another user', async () => {
    const { followId } = await FollowUseCase.createFollowRelation(prefix);
    expect(followId).toBeDefined();
  });

  it('should fail to follow oneself', async () => {
    const user = await UserFactory.create(prefix);
    const res: SupertestResponse<ApiErrorResponse> = await FollowClient.follow(
      user.accessToken,
      user.profile.id,
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain(
      '自分をフォローすることはできません',
    );
  });

  it('should fail to follow the same user twice (duplicate)', async () => {
    const { followee, follower } =
      await FollowUseCase.createFollowRelation(prefix);
    const res: SupertestResponse<ApiErrorResponse> = await FollowClient.follow(
      follower.accessToken,
      followee.profile.id,
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain(
      'すでにこのユーザーをフォローしています',
    );
  });

  it('should reject unauthenticated requests', async () => {
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.follow('', user.profile.id);

    expect(res.status).toBe(401);
  });

  it('should return 400 when followeeId is not a valid UUID', async () => {
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.follow(user.accessToken, 'isNotUuid');

    expect(res.status).toBe(400);
  });

  it('should return 404 when followeeId is a valid UUID but does not exist in DB', async () => {
    const user = await UserFactory.create(prefix);
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    const res: SupertestResponse<ApiErrorResponse> = await FollowClient.follow(
      user.accessToken,
      nonExistentId,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain(
      `User with id ${nonExistentId} not found`,
    );
  });
});
