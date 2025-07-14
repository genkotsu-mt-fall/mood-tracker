import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createGroup } from '../../test/utils/group-helper';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';

describe('GroupController (DELETE /group/:id)', () => {
  let app: INestApplication;
  const prefix = 'group_delete';
  const groupName = 'test group';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete the group if user is owner', async () => {
    const { groupOwnerToken, groupRes } = await createGroup(
      prefix,
      app,
      groupName,
    );

    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .delete(`/group/${groupId}`)
      .set(setToken(groupOwnerToken))
      .expect(200);

    await request(app.getHttpServer())
      .get(`/group/${groupId}`)
      .set(setToken(groupOwnerToken))
      .expect(404);
  });

  it('should return 401 if no token is provided', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);

    const groupId = groupRes.id;

    await request(app.getHttpServer()).delete(`/group/${groupId}`).expect(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);
    const { token: anotherUserToken } = await createAndLoginUser(prefix, app);

    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .delete(`/group/${groupId}`)
      .set(setToken(anotherUserToken))
      .expect(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const invalidGroupId = 'invalid-uuid';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .delete(`/group/${invalidGroupId}`)
      .set(setToken(token))
      .expect(400);
  });

  it('should return 404 if group does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .delete(`/group/${nonExistentGroupId}`)
      .set(setToken(token))
      .expect(404);
  });
});
