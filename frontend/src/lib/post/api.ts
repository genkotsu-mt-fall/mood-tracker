import { PrivacySetting } from '@genkotsu-mt-fall/shared/schemas';
import { PostCreateInput } from './schemas';
import { Fail, Ok } from '../http/result';
import { postRequest } from '../api/authed';

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

export async function createPostFromApi(
  payload: PostCreateInput,
): Promise<Ok<PostResponse> | Fail> {
  return postRequest<PostResponse>('post', payload);
}
