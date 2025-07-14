import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import {
  createAndLoginUser,
  getUser,
  setToken,
} from '../../test/utils/auth-helper';
import { createGroupAndAddMember } from '../../test/utils/group-member-helper';

describe('GroupMemberController (DELETE /group-member)', () => {
  let app: INestApplication;
  const prefix = 'groupMember_delete';
  const groupName = 'test group';
  let groupMemberId: string;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // 自分が削除
  it('should allow the group owner to delete a group member (204)', async () => {
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
      .delete(`/group-member/${groupMemberId}`)
      .set(setToken(groupOwnerToken))
      .expect(200);

    await request(app.getHttpServer())
      .get(`/group-member/${groupMemberId}`)
      .set(setToken(groupOwnerToken))
      .expect(404);
  });

  // 他人が削除できない
  it('should not allow a non-owner to delete the group member (403)', async () => {
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
    const { token: nonGroupOwnerToken } = await createAndLoginUser(prefix, app);

    await request(app.getHttpServer())
      .delete(`/group-member/${groupMemberId}`)
      .set(setToken(nonGroupOwnerToken))
      .expect(403);
  });

  // 404 Not Found
  it('should return 404 if group member does not exist', async () => {
    const nonExistentGroupMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { token } = await createAndLoginUser(prefix, app);
    await request(app.getHttpServer())
      .delete(`/group-member/${nonExistentGroupMemberId}`)
      .set(setToken(token))
      .expect(404);
  });

  // 401 tokenなし
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
      .delete(`/group-member/${groupMemberId}`)
      .expect(401);
  });

  // 400 InValidID
  it('should return 400 if invalid UUID is provided', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    await request(app.getHttpServer())
      .delete(`/group-member/invalid-uuid`)
      .set(setToken(token))
      .expect(400);
  });
});
