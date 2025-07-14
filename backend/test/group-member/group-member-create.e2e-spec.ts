import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createGroupAndAddMember } from '../../test/utils/group-member-helper';
import {
  createAndLoginUser,
  getUser,
  setToken,
} from '../../test/utils/auth-helper';
import { createGroup } from '../../test/utils/group-helper';

describe('GroupMemberController (POST /group-member)', () => {
  let app: INestApplication;
  const prefix = 'groupMember_create';
  const groupName = 'test group';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a groupMember to another user', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupRes, groupMemberRes } = await createGroupAndAddMember(
      prefix,
      app,
      groupName,
      memberId,
    );

    expect(groupMemberRes).toHaveProperty('id');
    expect(groupMemberRes.groupId).toBe(groupRes.id);
  });

  it('should fail to create groupMember oneself', async () => {
    const { groupRes, groupOwnerToken } = await createGroup(
      prefix,
      app,
      groupName,
    );
    const groupId = groupRes.id;
    const groupOwnerRequest = await getUser(app, groupOwnerToken);
    const groupOwnerId = groupOwnerRequest.body.id;

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(groupOwnerToken))
      .send({ groupId, memberId: groupOwnerId })
      .expect(400);
  });

  it('should not allow adding the same member to the same group more than once', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupRes, groupOwnerToken } = await createGroupAndAddMember(
      prefix,
      app,
      groupName,
      memberId,
    );

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(groupOwnerToken))
      .send({ groupId: groupRes.id, memberId })
      .expect(400);
  });

  it('should return 404 if memberId does not exist', async () => {
    const nonExistentMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    const { groupRes, groupOwnerToken } = await createGroup(
      prefix,
      app,
      groupName,
    );
    const groupId = groupRes.id;

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(groupOwnerToken))
      .send({ groupId, memberId: nonExistentMemberId })
      .expect(404);
  });

  it('should return 404 if groupId does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupOwnerToken } = await createGroup(prefix, app, groupName);

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(groupOwnerToken))
      .send({ groupId: nonExistentGroupId, memberId })
      .expect(404);
  });

  it('should return 401 if no auth token is provided', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);
    const groupId = groupRes.id;

    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    await request(app.getHttpServer())
      .post('/group-member')
      .send({ groupId, memberId })
      .expect(401);
  });

  it('should return 403 if user is not the owner of the group', async () => {
    const { groupRes } = await createGroup(prefix, app, groupName);
    const groupId = groupRes.id;

    const { token: attackerToken } = await createAndLoginUser(prefix, app);

    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(attackerToken))
      .send({ groupId, memberId })
      .expect(403);
  });

  it('should return 400 if groupId is not a valid UUID', async () => {
    const { token: groupOwnerToken } = await createAndLoginUser(prefix, app);

    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    await request(app.getHttpServer())
      .post('/group-member')
      .set(setToken(groupOwnerToken))
      .send({ groupId: 'invalid-uuid', memberId })
      .expect(400);
  });
});
