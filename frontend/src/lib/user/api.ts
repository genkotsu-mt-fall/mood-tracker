'use server';

import {
  MyProfileUpdateBody,
  UserListResponseSchema,
  UserResource,
  UserResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { getRequest, putRequest } from '../api/authed';
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

/** 他人のプロフィール */
export async function fetchUserProfileFromApi(
  id: string,
): Promise<Ok<UserResource> | Fail> {
  return getRequest<UserResource>(`user/${id}`, UserResourceSchema);
}

/** 他人のフォロワー一覧 */
export async function fetchUserFollowersFromApi(
  id: string,
): Promise<Ok<UserResource[]> | Fail> {
  return getRequest<UserResource[]>(
    `user/${id}/followers`,
    UserListResponseSchema,
  );
}

/** 他人がフォローしているユーザー一覧 */
export async function fetchUserFollowingUsersFromApi(
  id: string,
): Promise<Ok<UserResource[]> | Fail> {
  return getRequest<UserResource[]>(
    `user/${id}/following`,
    UserListResponseSchema,
  );
}

export async function updateMyProfileFromApi(
  payload: MyProfileUpdateBody,
): Promise<Ok<UserResource> | Fail> {
  return putRequest<UserResource>('auth/me', payload, UserResourceSchema);
}
