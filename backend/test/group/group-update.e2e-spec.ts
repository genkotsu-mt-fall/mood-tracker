import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createGroup } from '../../test/utils/group-helper';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';

describe('GroupController (PUT /group/:id)', () => {
  let app: INestApplication;
  const prefix = 'group_update';
  const groupName = 'test group';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update the group name if user is owner', async () => {
    const { groupOwnerToken, groupRes } = await createGroup(
      prefix,
      app,
      groupName,
    );

    const groupId = groupRes.id;

    const res = await request(app.getHttpServer())
      .put(`/group/${groupId}`)
      .set(setToken(groupOwnerToken))
      .send({ name: 'updated test group' })
      .expect(200);

    const body = res.body as { id: string; name: string };
    expect(body).toHaveProperty('id', groupId);
    expect(body.name).toBe('updated test group');
  });

  it('should return 401 if no token is provided', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);

    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .put(`/group/${groupId}`)
      .send({ name: 'updated test group' })
      .expect(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);
    const { token: anotherUserToken } = await createAndLoginUser(prefix, app);

    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .put(`/group/${groupId}`)
      .set(setToken(anotherUserToken))
      .send({ name: 'updated test group by not owner' })
      .expect(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const invalidGroupId = 'invalid-uuid';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .put(`/group/${invalidGroupId}`)
      .set(setToken(token))
      .send({ name: 'updated test group' })
      .expect(400);
  });

  it('should return 404 if group does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .put(`/group/${nonExistentGroupId}`)
      .set(setToken(token))
      .send({ name: 'updated test group' })
      .expect(404);
  });

  it('should not update a group without name', async () => {
    const { groupOwnerToken, groupRes } = await createGroup(
      prefix,
      app,
      groupName,
    );

    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .put(`/group/${groupId}`)
      .set(setToken(groupOwnerToken))
      .send({ name: '' })
      .expect(400);
  });
});
