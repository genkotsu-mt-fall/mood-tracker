import {
  GroupListResponseSchema,
  GroupCreateBody,
  GroupResource,
  GroupResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { getRequest, postRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

export async function fetchGroupsFromApi(): Promise<
  Ok<GroupResource[]> | Fail
> {
  return getRequest('auth/me/groups', GroupListResponseSchema);
}

export async function createGroupFromApi(
  payload: GroupCreateBody,
): Promise<Ok<GroupResource> | Fail> {
  return postRequest<GroupResource>('group', payload, GroupResourceSchema);
}
