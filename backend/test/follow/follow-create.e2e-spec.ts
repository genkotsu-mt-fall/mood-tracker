import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  createAndLoginUser,
  getUser,
  setToken,
} from '../../test/utils/auth-helper';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createFollowRelation } from '../../test/utils/follow-helper';

describe('FollowController (POST /follow)', () => {
  let app: INestApplication;
  const prefix = 'follower_create';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a follow to another user', async () => {
    const { createdFollow } = await createFollowRelation(prefix, app);
    expect(createdFollow).toHaveProperty('id');
  });

  it('should fail to follow oneself', async () => {
    const { token: followerToken } = await createAndLoginUser(prefix, app);

    const followerRequest = await getUser(app, followerToken);
    const followerId = followerRequest.body.id;

    const res = await request(app.getHttpServer())
      .post('/follow')
      .set(setToken(followerToken))
      .send({ followeeId: followerId })
      .expect(400);

    const body = res.body as { message: string };
    expect(body.message).toContain('自分をフォローすることはできません');
  });

  it('should fail to follow the same user twice (duplicate)', async () => {
    const { followerToken, followeeId } = await createFollowRelation(
      prefix,
      app,
    );

    const res = await request(app.getHttpServer())
      .post('/follow')
      .set(setToken(followerToken))
      .send({ followeeId })
      .expect(400);

    const body = res.body as { message: string };
    expect(body.message).toContain('すでにこのユーザーをフォローしています');
  });

  it('should reject unauthenticated requests', async () => {
    const { token: followeeToken } = await createAndLoginUser(prefix, app);

    const followeeRequest = await getUser(app, followeeToken);
    const followeeId = followeeRequest.body.id;

    await request(app.getHttpServer())
      .post('/follow')
      .send({ followeeId })
      .expect(401);
  });

  it('should return 400 when followeeId is not a valid UUID', async () => {
    const { token: followerToken } = await createAndLoginUser(prefix, app);

    const followeeId = 'isNotUuid';

    await request(app.getHttpServer())
      .post('/follow')
      .set(setToken(followerToken))
      .send({ followeeId })
      .expect(400);
  });

  it('should return 404 when followeeId is a valid UUID but does not exist in DB', async () => {
    const { token: followerToken } = await createAndLoginUser(prefix, app);

    const followeeId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // 存在しないはずのID

    const res = await request(app.getHttpServer())
      .post('/follow')
      .set(setToken(followerToken))
      .send({ followeeId })
      .expect(404);

    const body = res.body as { message: string };
    expect(body.message).toContain(`User with id ${followeeId} not found`);
  });
});
