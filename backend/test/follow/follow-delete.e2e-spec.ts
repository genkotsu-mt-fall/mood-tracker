import { AppBootstrapper } from '../../test/bootstrap/app-bootstrapper';
import { FollowUseCase } from '../../test/usecases/follow.usecase';
import { FollowClient } from '../../test/clients/follow.client';
import { UserFactory } from '../../test/factories/user.factory';

describe('FollowController (DELETE /follow)', () => {
  const prefix = 'follower_delete';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });
  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  // 正常に削除できる
  it('should delete a follow successfully if owned by the requester', async () => {
    const { followId, follower } =
      await FollowUseCase.createFollowRelation(prefix);
    const res = await FollowClient.unfollow(follower.accessToken, followId);

    const body = res.body as { message: string };
    expect(res.status).toBe(200);
    expect(body.message).toContain('Follow deleted successfully');

    const notFound = await FollowClient.getFollow(
      follower.accessToken,
      followId,
    );
    expect(notFound.status).toBe(404);
  });

  // 自分以外のフォローを削除
  it("should return 403 when trying to delete someone else's follow", async () => {
    const { followId } = await FollowUseCase.createFollowRelation(prefix);
    const user = await UserFactory.create(prefix);

    const res = await FollowClient.unfollow(user.accessToken, followId);
    expect(res.status).toBe(403);
  });

  // 未認証ユーザーが削除しようとする
  it('should return 401 when unauthenticated user tries to delete a follow', async () => {
    const { followId } = await FollowUseCase.createFollowRelation(prefix);
    const res = await FollowClient.unfollow('', followId);
    expect(res.status).toBe(401);
  });

  // 存在しない ID を指定
  it('should return 404 when trying to delete a non-existent follow', async () => {
    const nonExistentFollowId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.unfollow(
      user.accessToken,
      nonExistentFollowId,
    );

    const body = res.body as { message: string };
    expect(res.status).toBe(404);
    expect(body.message).toContain(
      `Follow with id ${nonExistentFollowId} not found`,
    );
  });

  // UUID でない ID を指定
  it('should return 400 when follow ID is not a valid UUID', async () => {
    const invalidFollowId = '123';
    const user = await UserFactory.create(prefix);
    const res = await FollowClient.unfollow(user.accessToken, invalidFollowId);
    expect(res.status).toBe(400);
  });
});
