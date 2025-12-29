import {
  GroupMemberCreateBody,
  GroupMemberResource,
  GroupMemberResourceSchema,
  MessageResource,
  MessageResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { delRequest, postRequest } from '../api/authed';
import type { Fail, Ok } from '../http/result';

export async function createGroupMemberFromApi(
  payload: GroupMemberCreateBody,
): Promise<Ok<GroupMemberResource> | Fail> {
  return postRequest<GroupMemberResource>(
    'group-member',
    payload,
    GroupMemberResourceSchema,
  );
}

export async function deleteGroupMemberFromApi(
  groupId: string,
  memberId: string,
): Promise<Ok<MessageResource> | Fail> {
  return delRequest<MessageResource>(
    `group-member/group/${groupId}/member/${memberId}`,
    MessageResourceSchema,
  );
}
