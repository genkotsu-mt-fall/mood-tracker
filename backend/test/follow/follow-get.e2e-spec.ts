import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { FollowUseCase } from 'test/usecases/follow.usecase';
import { FollowClient } from 'test/clients/follow.client';
import { UserFactory } from 'test/factories/user.factory';

describe('FollowController (GET /follow)', () => {
  const prefix = 'follower_get';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should return 200 with follow data when follow ID exists', async () => {
    const { followId, follower, followee } =
      await FollowUseCase.createFollowRelation(prefix);
    const res = await FollowClient.getFollow(follower.accessToken, followId);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', followId);
    expect(res.body).toHaveProperty('followerId', follower.profile.id);
    expect(res.body).toHaveProperty('followeeId', followee.profile.id);
  });

  it('should return 404 when follow ID does not exist', async () => {
    const nonExistentFollowId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.getFollow(
      user.accessToken,
      nonExistentFollowId,
    );

    const body = res.body as { message: string };
    expect(res.status).toBe(404);
    expect(body.message).toContain(
      `Follow with id ${nonExistentFollowId} not found`,
    );
  });

  it('should return 400 when follow ID is not a valid UUID', async () => {
    const invalidFollowId = 'invalid-uuid';
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.getFollow(user.accessToken, invalidFollowId);

    expect(res.status).toBe(400);
  });

  it('should return 401 if unauthenticated', async () => {
    const { followId } = await FollowUseCase.createFollowRelation(prefix);
    const res = await FollowClient.getFollow('', followId);
    expect(res.status).toBe(401);
  });
});
