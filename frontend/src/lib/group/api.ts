import { getRequest, postRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

export type GroupData = {
  id: string;
  name: string;
};

export async function fetchGroupsFromApi(): Promise<Ok<GroupData[]> | Fail> {
  return getRequest<GroupData[]>('/auth/me/groups');
}

type CreateGroupPayload = { name: string };

export async function createGroupFromApi(
  payload: CreateGroupPayload,
): Promise<Ok<GroupData> | Fail> {
  return postRequest<GroupData>('/group', payload);
}
