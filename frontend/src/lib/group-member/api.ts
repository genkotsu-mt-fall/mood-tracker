import { postRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

type CreateGroupMember = {
  groupId: string;
  memberId: string;
};

export type GroupMemberData = {
  id: string;
  groupId: string;
  memberId: string;
};

export async function createGroupMemberFromApi(
  payload: CreateGroupMember,
): Promise<Ok<GroupMemberData> | Fail> {
  return postRequest<GroupMemberData>('group-member', payload);
}
