import {
  GroupListResponseSchema,
  GroupCreateBody,
  GroupResource,
  GroupResourceSchema,
  UserResource,
  UserListResponseSchema,
  GroupUpdateBody,
  GroupMembersDiffBody,
} from '@genkotsu-mt-fall/shared/schemas';
import { getRequest, postRequest, putRequest } from '../api/authed';
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

export async function updateGroupFromApi(
  id: string,
  payload: GroupUpdateBody,
): Promise<Ok<GroupResource> | Fail> {
  return putRequest<GroupResource>(`group/${id}`, payload, GroupResourceSchema);
}

export async function updateGroupMembersFromApi(
  id: string,
  payload: GroupMembersDiffBody,
): Promise<Ok<UserResource[]> | Fail> {
  return putRequest<UserResource[]>(
    `group/${id}/members`,
    payload,
    UserListResponseSchema,
  );
}
