'use server';

import {
  UserListResponseSchema,
  UserResource,
  UserResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { getRequest } from '../api/authed';
import { Fail, Ok } from '../http/result';

export async function fetchUsersFromApi(): Promise<Ok<UserResource[]> | Fail> {
  return await getRequest<UserResource[]>('user', UserListResponseSchema); //TODO: Pagination
}

export async function fetchMyProfileFromApi(): Promise<
  Ok<UserResource> | Fail
> {
  return getRequest<UserResource>('auth/me', UserResourceSchema);
}

// 自分のフォロワー一覧
export async function fetchMyFollowersFromApi(): Promise<
  Ok<UserResource[]> | Fail
> {
  return getRequest<UserResource[]>(
    'auth/me/followers',
    UserListResponseSchema,
  );
}

// 自分がフォローしているユーザー一覧
export async function fetchMyFollowingUsersFromApi(): Promise<
  Ok<UserResource[]> | Fail
> {
  return getRequest<UserResource[]>(
    'auth/me/following',
    UserListResponseSchema,
  );
}
