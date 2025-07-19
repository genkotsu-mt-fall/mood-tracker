import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupMemberUseCase } from 'test/usecases/group-member.usecase';
import { GroupUseCase } from 'test/usecases/group.usecase';
import { GroupMemberClient } from 'test/clients/group-member.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupMemberController (POST /group-member)', () => {
  const prefix = 'groupMember_create';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should create a groupMember to another user', async () => {
    const { groupMember, group, member } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    expect(groupMember).toHaveProperty('id');
    expect(groupMember).toHaveProperty('groupId', group.id);
    expect(groupMember).toHaveProperty('memberId', member.profile.id);
  });

  it('should fail to create groupMember oneself', async () => {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const res = await GroupMemberClient.join(
      groupOwner.accessToken,
      group.id,
      groupOwner.profile.id,
    );
    expect(res.status).toBe(400);
  });

  it('should not allow adding the same member to the same group more than once', async () => {
    const { group, groupOwner, member } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.join(
      groupOwner.accessToken,
      group.id,
      member.profile.id,
    );

    expect(res.status).toBe(400);
  });

  it('should return 404 if memberId does not exist', async () => {
    const nonExistentMemberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { group, groupOwner } =
      await GroupMemberUseCase.createGroupAndAddMember(prefix);
    const res = await GroupMemberClient.join(
      groupOwner.accessToken,
      group.id,
      nonExistentMemberId,
    );
    expect(res.status).toBe(404);
  });

  it('should return 404 if groupId does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const { groupOwner } = await GroupUseCase.createGroup(prefix);
    const member = await UserFactory.create(prefix);
    const res = await GroupMemberClient.join(
      groupOwner.accessToken,
      nonExistentGroupId,
      member.profile.id,
    );
    expect(res.status).toBe(404);
  });

  it('should return 401 if no auth token is provided', async () => {
    const { group } = await GroupUseCase.createGroup(prefix);
    const member = await UserFactory.create(prefix);
    const res = await GroupMemberClient.join('', group.id, member.profile.id);
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not the owner of the group', async () => {
    const { group } = await GroupUseCase.createGroup(prefix);
    const member = await UserFactory.create(prefix);
    const nonGroupOwner = await UserFactory.create(prefix);
    const res = await GroupMemberClient.join(
      nonGroupOwner.accessToken,
      group.id,
      member.profile.id,
    );
    expect(res.status).toBe(403);
  });

  it('should return 400 if groupId is not a valid UUID', async () => {
    const member = await UserFactory.create(prefix);
    const res = await GroupMemberClient.join(
      member.accessToken,
      'invalid-uuid',
      member.profile.id,
    );
    expect(res.status).toBe(400);
  });
});
