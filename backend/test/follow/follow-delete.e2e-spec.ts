import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createFollowRelation } from '../../test/utils/follow-helper';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';

describe('FollowController (DELETE /follow)', () => {
  let app: INestApplication;
  const prefix = 'follower_delete';

  beforeAll(async () => {
    app = await setupE2EApp();
  });
  afterAll(async () => {
    await app.close();
  });

  // 正常に削除できる
  it('should delete a follow successfully if owned by the requester', async () => {
    const { followerToken, followId } = await createFollowRelation(prefix, app);

    const res = await request(app.getHttpServer())
      .delete(`/follow/${followId}`)
      .set(setToken(followerToken))
      .expect(200);

    const body = res.body as { message: string };
    expect(body.message).toContain('Follow deleted successfully');

    await request(app.getHttpServer())
      .get(`/follow/${followId}`)
      .set(setToken(followerToken))
      .expect(404);
  });

  // 自分以外のフォローを削除
  it("should return 403 when trying to delete someone else's follow", async () => {
    const { followId } = await createFollowRelation(prefix, app);
    const { token: anotherUserToken } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .delete(`/follow/${followId}`)
      .set(setToken(anotherUserToken))
      .expect(403);
  });

  // 未認証ユーザーが削除しようとする
  it('should return 401 when unauthenticated user tries to delete a follow', async () => {
    const { followId } = await createFollowRelation(prefix, app);
    await request(app.getHttpServer())
      .delete(`/follow/${followId}`)
      .expect(401);
  });

  // 存在しない ID を指定
  it('should return 404 when trying to delete a non-existent follow', async () => {
    const nonExistentFollowId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);

    const res = await request(app.getHttpServer())
      .delete(`/follow/${nonExistentFollowId}`)
      .set(setToken(token))
      .expect(404);

    const body = res.body as { message: string };
    expect(body.message).toContain(
      `Follow with id ${nonExistentFollowId} not found`,
    );
  });

  // UUID でない ID を指定
  it('should return 400 when follow ID is not a valid UUID', async () => {
    const invalidFollowId = '123';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .delete(`/follow/${invalidFollowId}`)
      .set(setToken(token))
      .expect(400);
  });
});
