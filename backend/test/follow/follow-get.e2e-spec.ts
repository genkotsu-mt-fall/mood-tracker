import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';
import { createFollowRelation } from '../../test/utils/follow-helper';

describe('FollowController (GET /follow)', () => {
  let app: INestApplication;
  const prefix = 'follower_get';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with follow data when follow ID exists', async () => {
    const { followerToken, followeeId, followId } = await createFollowRelation(
      prefix,
      app,
    );

    const followGetRes = await request(app.getHttpServer())
      .get(`/follow/${followId}`)
      .set(setToken(followerToken))
      .expect(200);

    const followData = followGetRes.body as {
      id: string;
      followerId: string;
      followeeId: string;
    };
    expect(followData).toHaveProperty('id', followId);
    expect(followData).toHaveProperty('followerId');
    expect(followData).toHaveProperty('followeeId', followeeId);
  });

  it('should return 404 when follow ID does not exist', async () => {
    const nonExistentFollowId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);

    const res = await request(app.getHttpServer())
      .get(`/follow/${nonExistentFollowId}`)
      .set(setToken(token))
      .expect(404);

    const body = res.body as { message: string };
    expect(body.message).toContain(
      `Follow with id ${nonExistentFollowId} not found`,
    );
  });

  it('should return 400 when follow ID is not a valid UUID', async () => {
    const invalidFollowId = 'invalid-uuid';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .get(`/follow/${invalidFollowId}`)
      .set(setToken(token))
      .expect(400);
  });

  it('should return 401 if unauthenticated', async () => {
    const { followId } = await createFollowRelation(prefix, app);
    await request(app.getHttpServer()).get(`/follow/${followId}`).expect(401);
  });
});
