import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupMemberUseCase } from 'test/usecases/group-member.usecase';
import { GroupMemberClient } from 'test/clients/group-member.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupMemberController (DELETE /group-member)', () => {
  const prefix = 'groupMember_delete';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  // 自分が削除
  it('should allow the group owner to delete a group member (204)', async () => {
    const { groupMember, groupOwner } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const groupMemDeleteResponse = await GroupMemberClient.remove(
      groupOwner.accessToken,
      groupMember.id,
    );
    expect(groupMemDeleteResponse.status).toBe(200);
    const nonExistentGroupMemberResponse = await GroupMemberClient.get(
      groupOwner.accessToken,
      groupMember.id,
    );
    expect(nonExistentGroupMemberResponse.status).toBe(404);
  });

  // 他人が削除できない
  it('should not allow a non-owner to delete the group member (403)', async () => {
    const nonGroupOwner = await UserFactory.create(prefix);
    const { groupMember } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.remove(
      nonGroupOwner.accessToken,
      groupMember.id,
    );
    expect(res.status).toBe(403);
  });

  // 404 Not Found
  it('should return 404 if group member does not exist', async () => {
    const nonExistentGroupMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await GroupMemberClient.remove(
      user.accessToken,
      nonExistentGroupMemberId,
    );
    expect(res.status).toBe(404);
  });

  // 401 tokenなし
  it('should return 401 if no token is provided', async () => {
    const { groupMember } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.remove('', groupMember.id);
    expect(res.status).toBe(401);
  });

  // 400 InValidID
  it('should return 400 if invalid UUID is provided', async () => {
    const { groupOwner } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.remove(
      groupOwner.accessToken,
      'invalid-uuid',
    );
    expect(res.status).toBe(400);
  });
});
