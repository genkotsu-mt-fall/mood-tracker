import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import {
  createAndLoginUser,
  getUser,
  setToken,
} from '../../test/utils/auth-helper';
import { createGroupAndAddMember } from '../../test/utils/group-member-helper';

describe('GroupMemberController (GET /group-member)', () => {
  let app: INestApplication;
  const prefix = 'groupMember_get';
  const groupName = 'test group';
  let groupMemberId: string;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 and the group member data when valid id is provided', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupMemberRes, groupOwnerToken } = await createGroupAndAddMember(
      prefix,
      app,
      groupName,
      memberId,
    );

    groupMemberId = groupMemberRes.id;

    await request(app.getHttpServer())
      .get(`/group-member/${groupMemberId}`)
      .set(setToken(groupOwnerToken))
      .expect(200);
  });

  it('should return 404 when group member does not exist', async () => {
    const nonExistentGroupMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);
    await request(app.getHttpServer())
      .get(`/group-member/${nonExistentGroupMemberId}`)
      .set(setToken(token))
      .expect(404);
  });

  it('should return 403 if unrelated user tries to access group member info', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupMemberRes } = await createGroupAndAddMember(
      prefix,
      app,
      groupName,
      memberId,
    );

    groupMemberId = groupMemberRes.id;
    const { token: notGroupOwnerToken } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .get(`/group-member/${groupMemberId}`)
      .set(setToken(notGroupOwnerToken))
      .expect(403);
  });

  it('should return 401 if no token is provided', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const memberRequest = await getUser(app, token);
    const memberId = memberRequest.body.id;

    const { groupMemberRes } = await createGroupAndAddMember(
      prefix,
      app,
      groupName,
      memberId,
    );

    groupMemberId = groupMemberRes.id;

    await request(app.getHttpServer())
      .get(`/group-member/${groupMemberId}`)
      .expect(401);
  });
});
