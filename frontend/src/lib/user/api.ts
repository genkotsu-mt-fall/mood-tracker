'use server';

import { getRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

export type UserData = { id: string; email: string; name?: string | null };

export type ApiUser = {
  id: string;
  name: string;
};

export async function fetchUsersFromApi(): Promise<Ok<UserData[]> | Fail> {
  return await getRequest<UserData[]>('user'); //TODO: Pagination
}
