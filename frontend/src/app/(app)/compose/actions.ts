'use server';
import { parseForm, parseObject } from '@/lib/actions/parse';
import { apiFieldErrorsToUi } from '@/lib/actions/state';
import { createPostFromApi, PostResponse } from '@/lib/post/api';
import {
  composeSchema,
  PostCreateInput,
  postCreateSchema,
} from '@/lib/post/schemas';

// type CreatePostState = ActionState<keyof PostCreateInput & string>;

export type Bound = { privacyJson?: PostCreateInput['privacyJson'] };

type FieldType<F extends string = string> = Partial<Record<F, string>>;
export type Phase = 'idle' | 'success' | 'error';
type Idle = { ok: true; phase: 'idle'; data?: undefined };

type ActionResult<T, F extends string = string> =
  | { ok: true; phase: Phase; data: T }
  | { ok: false; phase: Phase; error?: string; fields?: FieldType<F> };

export type CreatePostActionResult =
  | ActionResult<PostResponse, keyof PostCreateInput & string>
  | Idle;

export async function createPostAction(
  bound: Bound,
  _prev: CreatePostActionResult | undefined,
  formData: FormData,
): Promise<CreatePostActionResult> {
  // FormData 側スキーマを検証
  const formValidation = parseForm(formData, composeSchema);
  if (!formValidation.ok) {
    return { ok: false, phase: 'error', fields: formValidation.fields };
  }

  // bound で渡された privacyJson をマージ
  const assembledInput: PostCreateInput = {
    ...formValidation.data,
    privacyJson: bound.privacyJson || undefined,
  };

  // 最終スキーマを検証
  const inputValidation = parseObject(assembledInput, postCreateSchema);
  if (!inputValidation.ok) {
    return { ok: false, phase: 'error', fields: inputValidation.fields };
  }

  const res = await createPostFromApi(inputValidation.data);

  if (!res.ok) {
    return {
      ok: false,
      phase: 'error',
      error: res.message,
      fields: apiFieldErrorsToUi(res.fields),
    };
  }

  return { ok: true, phase: 'success', data: res.data };
}
