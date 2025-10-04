'use server';
import { parseForm, parseObject } from '@/lib/actions/parse';
import { ActionState, apiFieldErrorsToUi } from '@/lib/actions/state';
import { createPost, PostResponse } from '@/lib/post/api';
import {
  composeSchema,
  PostCreateInput,
  postCreateSchema,
} from '@/lib/post/schemas';

export type CreatePostState = ActionState<keyof PostCreateInput & string> & {
  created?: PostResponse;
};

export type Bound = { privacyJson?: PostCreateInput['privacyJson'] };

export async function createPostAction(
  bound: Bound,
  _prev: CreatePostState | undefined,
  formData: FormData,
): Promise<CreatePostState> {
  // FormData 側スキーマを検証
  const formValidation = parseForm(formData, composeSchema);
  if (!formValidation.ok) {
    return { ok: false, fields: formValidation.fields };
  }

  // bound で渡された privacyJson をマージ
  const assembledInput: PostCreateInput = {
    ...formValidation.data,
    privacyJson: bound.privacyJson || undefined,
  };

  // 最終スキーマを検証
  const inputValidation = parseObject(assembledInput, postCreateSchema);
  if (!inputValidation.ok) {
    return { ok: false, fields: inputValidation.fields };
  }

  const res = await createPost(inputValidation.data);

  if (!res.ok) {
    return {
      ok: false,
      error: res.message,
      fields: apiFieldErrorsToUi(res.fields),
    };
  }

  return { ok: true, created: res.data };
}
