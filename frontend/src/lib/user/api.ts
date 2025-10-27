'use server';

import {
  UserListResponseSchema,
  UserResource,
} from '@genkotsu-mt-fall/shared/schemas';
import { getRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

export async function fetchUsersFromApi(): Promise<Ok<UserResource[]> | Fail> {
  return await getRequest<UserResource[]>('user', UserListResponseSchema); //TODO: Pagination
}
