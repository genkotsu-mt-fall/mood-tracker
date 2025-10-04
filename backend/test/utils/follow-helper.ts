import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createAndLoginUser, getUser, setToken } from './auth-helper';

interface FollowRelationResult {
  followerToken: string;
  followeeId: string;
  followId: string;
  createdFollow: { id: string };
}

export const createFollowRelation = async (
  prefix: string,
  app: INestApplication,
): Promise<FollowRelationResult> => {
  const { token: followerToken } = await createAndLoginUser(prefix, app);
  const { token: followeeToken } = await createAndLoginUser(prefix, app);

  const followeeRequest = await getUser(app, followeeToken);
  const followeeId = followeeRequest.body.id;

  const followCreateRes = await request(app.getHttpServer())
    .post('/follow')
    .set(setToken(followerToken))
    .send({ followeeId })
    .expect(201);

  const createdFollow = followCreateRes.body as { id: string };
  const followId = createdFollow.id;

  return { followerToken, followeeId, createdFollow, followId };
};
