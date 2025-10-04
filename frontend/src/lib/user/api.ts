'use server';

import { readAccessTokenFromServer } from '../auth/cookies';
import { getJsonAuth, HttpJsonResult } from '../http/json';
import { Fail, Ok, toOkFail } from '../http/result';

export type UserData = { id: string; email: string; name?: string | null };

export type ApiUser = {
  id: string;
  name: string;
};

export async function fetchUsers(): Promise<Ok<UserData[]> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<UserData[]> = await getJsonAuth('user', token); //TODO: Pagination
  return toOkFail<UserData[]>(r);
}
