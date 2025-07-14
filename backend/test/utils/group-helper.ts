import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createAndLoginUser, getUser, setToken } from './auth-helper';

export interface GroupResult {
  groupRes: { id: string; name: string; userId: string };
  groupOwnerToken: string;
  groupOwnerId: string;
}

export const createGroup = async (
  prefix: string,
  app: INestApplication,
  groupName: string,
): Promise<GroupResult> => {
  const { token } = await createAndLoginUser(prefix, app);
  const groupOwnerRequest = await getUser(app, token);
  const groupOwnerId = groupOwnerRequest.body.id;

  const res = await request(app.getHttpServer())
    .post('/group')
    .set(setToken(token))
    .send({ name: groupName })
    .expect(201);
  const body = res.body as { id: string; name: string; userId: string };

  return { groupRes: body, groupOwnerToken: token, groupOwnerId };
};
