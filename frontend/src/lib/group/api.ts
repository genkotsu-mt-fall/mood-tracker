import { readAccessTokenFromServer } from '../auth/cookies';
import { getJsonAuth, HttpJsonResult, postJsonAuth } from '../http/json';
import { Fail, Ok, toOkFail } from '../http/result';

export type GroupData = {
  id: string;
  name: string;
};

export async function fetchGroupsFromApi(): Promise<Ok<GroupData[]> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<GroupData[]> = await getJsonAuth(
    'auth/me/groups',
    token,
  );
  return toOkFail<GroupData[]>(r);
}

type CreateGroupPayload = { name: string };

export async function createGroupFromApi(
  payload: CreateGroupPayload,
): Promise<Ok<GroupData> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };

  const r: HttpJsonResult<GroupData> = await postJsonAuth(
    'group',
    payload,
    token,
  );
  return toOkFail<GroupData>(r);
}
