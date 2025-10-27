import {
  PostCreateBody,
  PostListResponseSchema,
  PostResource,
  PostResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { Fail, Ok } from '../http/result';
import { getRequest, postRequest } from '../api/authed';
// import { postRequest } from '../api/authed';

// export type PostResponse = {
//   id: string;
//   userId: string;
//   body: string;
//   createdAt: string;
//   updatedAt: string;
//   crisisFlag: boolean;
//   mood?: string;
//   intensity?: number;
//   emoji?: string;
//   templateId?: string;
//   privacyJson?: PrivacySetting;
// };

export async function createPostFromApi(
  payload: PostCreateBody,
): Promise<Ok<PostResource> | Fail> {
  return postRequest<PostResource>('post', payload, PostResourceSchema);
}

export async function fetchPostsFromApi(): Promise<Ok<PostResource[]> | Fail> {
  return getRequest<PostResource[]>('post', PostListResponseSchema);
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
