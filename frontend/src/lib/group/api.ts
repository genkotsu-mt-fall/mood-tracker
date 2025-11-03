import {
  GroupListResponseSchema,
  GroupCreateBody,
  GroupResource,
  GroupResourceSchema,
  UserResource,
  UserListResponseSchema,
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

export async function fetchGroupFromApi(
  id: string,
): Promise<Ok<GroupResource> | Fail> {
  return getRequest<GroupResource>(`group/${id}`, GroupResourceSchema);
}

export async function fetchGroupMembersFromApi(
  id: string,
): Promise<Ok<UserResource[]> | Fail> {
  return getRequest<UserResource[]>(
    `group/${id}/members`,
    UserListResponseSchema,
  );
}
