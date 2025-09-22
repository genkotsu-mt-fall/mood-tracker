import { PrivacySetting } from '@genkotsu-mt-fall/shared/schemas';
import { PostCreateInput } from './schemas';
import { Fail, Ok, toOkFail } from '../http/result';
import { postJsonWithCookieAuth } from '../http/server';

export type PostResponse = {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  crisisFlag: boolean;
  mood?: string;
  intensity?: number;
  emoji?: string;
  templateId?: string;
  privacyJson?: PrivacySetting;
};

export async function createPost(
  payload: PostCreateInput,
): Promise<Ok<PostResponse> | Fail> {
  const res = await postJsonWithCookieAuth<PostResponse>('post', payload);
  return toOkFail<PostResponse>(res);
}
