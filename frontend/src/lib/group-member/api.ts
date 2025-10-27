import {
  GroupMemberCreateBody,
  GroupMemberResource,
  GroupMemberResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { postRequest } from '../api/authed';
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
