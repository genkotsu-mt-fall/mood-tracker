'use server';
import { parseForm, parseObject } from '@/lib/actions/parse';
import { apiFieldErrorsToUi } from '@/lib/actions/state';
import { createPostFromApi, PostResponse } from '@/lib/post/api';
import {
  PostCreateBody,
  PostCreateBodySchema,
  PostCreateBodyWithoutPrivacySchema,
} from '@genkotsu-mt-fall/shared/schemas';

// type CreatePostState = ActionState<keyof PostCreateInput & string>;

export type Bound = Partial<Pick<PostCreateBody, 'privacyJson'>>;

type FieldType<F extends string = string> = Partial<Record<F, string>>;
export type Phase = 'idle' | 'success' | 'error';
type Idle = { ok: true; phase: 'idle'; data?: undefined };

type ActionResult<T, F extends string = string> =
  | { ok: true; phase: Phase; data: T }
  | { ok: false; phase: Phase; error?: string; fields?: FieldType<F> };

export type CreatePostActionResult =
  | ActionResult<PostResponse, keyof PostCreateBody & string>
  | Idle;

export async function createPostAction(
  bound: Bound,
  _prev: CreatePostActionResult | undefined,
  formData: FormData,
): Promise<CreatePostActionResult> {
  // FormData 側スキーマを検証
  const formValidation = parseForm(
    formData,
    PostCreateBodyWithoutPrivacySchema,
  );
  if (!formValidation.ok) {
    return { ok: false, phase: 'error', fields: formValidation.fields };
  }

  // bound で渡された privacyJson をマージ
  const assembledInput: PostCreateBody = {
    ...formValidation.data,
    privacyJson: bound.privacyJson || undefined,
  };

  // 最終スキーマを検証
  const inputValidation = parseObject(assembledInput, PostCreateBodySchema);
  if (!inputValidation.ok) {
    return { ok: false, phase: 'error', fields: inputValidation.fields };
  }

  const res = await createPostFromApi(inputValidation.data); // TODO: スキーマが.strictでないので、プロパティを指定して渡すか、.strict + Server Actionの内部変数を除外する

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
