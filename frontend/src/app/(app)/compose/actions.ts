'use server';
import { parseForm } from '@/lib/actions/parse';
import { ActionState, apiFieldErrorsToUi } from '@/lib/actions/state';
import { createPost, PostResponse } from '@/lib/post/api';
import { PostCreateInput, postCreateSchema } from '@/lib/post/schemas';

export type CreatePostState = ActionState<keyof PostCreateInput & string> & {
  created?: PostResponse;
};

export async function createPostAction(
  _prev: CreatePostState | undefined,
  formData: FormData,
): Promise<CreatePostState> {
  const parsed = parseForm(formData, postCreateSchema);
  if (!parsed.ok) {
    return { ok: false, fields: parsed.fields };
  }

  const res = await createPost(parsed.data);

  if (!res.ok) {
    return {
      ok: false,
      error: res.message,
      fields: apiFieldErrorsToUi(res.fields),
    };
  }

  return { ok: true, created: res.data };
}
