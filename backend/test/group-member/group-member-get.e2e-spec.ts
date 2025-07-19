import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupMemberUseCase } from 'test/usecases/group-member.usecase';
import { GroupMemberClient } from 'test/clients/group-member.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupMemberController (GET /group-member)', () => {
  const prefix = 'groupMember_get';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should return 200 and the group member data when valid id is provided', async () => {
    const { groupMember, groupOwner } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.get(
      groupOwner.accessToken,
      groupMember.id,
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', groupMember.id);
    expect(res.body).toHaveProperty('groupId', groupMember.groupId);
    expect(res.body).toHaveProperty('memberId', groupMember.memberId);
  });

  it('should return 404 when group member does not exist', async () => {
    const nonExistentGroupMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await GroupMemberClient.get(
      user.accessToken,
      nonExistentGroupMemberId,
    );
    expect(res.status).toBe(404);
  });

  it('should return 403 if unrelated user tries to access group member info', async () => {
    const nonGroupOwner = await UserFactory.create(prefix);
    const { groupMember } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.get(
      nonGroupOwner.accessToken,
      groupMember.id,
    );
    expect(res.status).toBe(403);
  });

  it('should return 401 if no token is provided', async () => {
    const { groupMember } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.get('', groupMember.id);
    expect(res.status).toBe(401);
  });
});
