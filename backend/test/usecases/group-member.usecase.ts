import { UserFactory } from 'test/factories/user.factory';
import { GroupUseCase } from './group.usecase';
import { GroupMemberClient } from 'test/clients/group-member.client';
import { ApiResponse, SupertestResponse } from 'test/types/api';

export type SupertestGroupMemberResponse = SupertestResponse<
  ApiResponse<{
    id: string;
    groupId: string;
    memberId: string;
  }>
>;

export class GroupMemberUseCase {
  static async joinAsMember(
    prefix: string,
    groupOwnerToken: string,
    groupId: string,
  ) {
    const member = await UserFactory.create(prefix);
    const res: SupertestGroupMemberResponse = await GroupMemberClient.join(
      groupOwnerToken,
      groupId,
      member.profile.id,
    );

    expect(res.status).toBe(201);

    const groupMember = res.body.data;

    return {
      member,
      groupMember,
    };
  }

  static async createGroupAndAddMember(prefix: string) {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const { member, groupMember } = await this.joinAsMember(
      prefix,
      groupOwner.accessToken,
      group.id,
    );
    return {
      group,
      groupOwner,
      member,
      groupMember,
    };
  }
}
