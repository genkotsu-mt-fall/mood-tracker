import {
  GroupCreateBody,
  GroupResourceSchema,
  GroupResource,
  UserResource,
  UserListResponseSchema,
  GroupUpdateBody,
  GroupMembersDiffBody,
  MessageResourceSchema,
  MessageResource,
} from '@genkotsu-mt-fall/shared/schemas';
import { Option } from '../common/types';
import { bffPost, unwrapOrThrow, bffPut, bffDel } from '@/lib/bff/request';

export async function createGroupClient(name: string): Promise<Option> {
  const r = await bffPost(
    '/api/group',
    { name } satisfies GroupCreateBody,
    GroupResourceSchema,
  );

  const g = unwrapOrThrow(r);
  return { id: g.id, label: g.name };
}

export async function updateGroupClient(
  id: string,
  payload: GroupUpdateBody,
): Promise<GroupResource> {
  const r = await bffPut<GroupResource>(
    `/api/group/${id}`,
    payload,
    GroupResourceSchema,
  );
  return unwrapOrThrow(r);
}

export async function updateGroupMembersDiffClient(
  id: string,
  payload: GroupMembersDiffBody,
): Promise<UserResource[]> {
  const r = await bffPut<UserResource[]>(
    `/api/group/${id}/members`,
    payload,
    UserListResponseSchema,
  );
  return unwrapOrThrow(r);
}

export async function deleteGroupClient(id: string): Promise<MessageResource> {
  const r = await bffDel<MessageResource>(
    `/api/group/${id}`,
    MessageResourceSchema,
  );
  return unwrapOrThrow(r);
}
