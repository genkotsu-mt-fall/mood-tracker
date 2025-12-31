'use server';

import {
  PostCreateBody,
  PostListResponseSchema,
  PostResource,
  PostResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { Fail, Ok } from '../http/result';
import { getRequest, postRequest } from '../api/authed';

export async function createPostFromApi(
  payload: PostCreateBody,
): Promise<Ok<PostResource> | Fail> {
  return postRequest<PostResource>('post', payload, PostResourceSchema);
}

export async function fetchPostsFromApi(): Promise<Ok<PostResource[]> | Fail> {
  return getRequest<PostResource[]>('post', PostListResponseSchema);
}

export async function fetchPostFromApi(
  id: string,
): Promise<Ok<PostResource> | Fail> {
  return getRequest<PostResource>(`post/${id}`, PostResourceSchema);
}

export async function fetchMyPostsFromApi(): Promise<
  Ok<PostResource[]> | Fail
> {
  return getRequest<PostResource[]>('auth/me/posts', PostListResponseSchema);
}

export async function fetchFollowingPostsFromApi(): Promise<
  Ok<PostResource[]> | Fail
> {
  return getRequest<PostResource[]>(
    'auth/me/following/posts',
    PostListResponseSchema,
  );
}

/** 他人の投稿一覧（page/limit無し） */
export async function fetchUserPostsFromApi(
  userId: string,
): Promise<Ok<PostResource[]> | Fail> {
  return getRequest<PostResource[]>(
    `user/${userId}/posts`,
    PostListResponseSchema,
  );
}
