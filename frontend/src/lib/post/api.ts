'use server';

import {
  PostCreateBody,
  PostListResponseSchema,
  PostResource,
  PostResourceSchema,
  MessageResource,
  MessageResourceSchema,
  PostUpdateBody,
} from '@genkotsu-mt-fall/shared/schemas';
import { Fail, Ok } from '../http/result';
import { delRequest, getRequest, postRequest, putRequest } from '../api/authed';

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

/** 投稿削除 */
export async function deletePostFromApi(
  id: string,
): Promise<Ok<MessageResource> | Fail> {
  return delRequest<MessageResource>(`post/${id}`, MessageResourceSchema);
}

export async function updatePostBodyFromApi(
  postId: string,
  payload: PostUpdateBody,
): Promise<Ok<PostResource> | Fail> {
  const { body, emoji, intensity, crisisFlag, privacyJson } = payload;

  // 送信プロパティを明示（余計な混入を避ける）
  const reqBody: PostUpdateBody = {
    body,
    crisisFlag,
    ...(emoji !== undefined ? { emoji } : {}),
    ...(intensity !== undefined ? { intensity } : {}),
    ...(privacyJson !== undefined ? { privacyJson } : {}),
  };

  // エンドポイントは create と同系統の想定（必要ならここだけ調整）
  return putRequest<PostResource>(
    `post/${postId}`,
    reqBody,
    PostResourceSchema,
  );
}
