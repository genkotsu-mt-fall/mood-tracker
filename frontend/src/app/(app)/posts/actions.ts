'use server';

import { parseForm, parseObject } from '@/lib/actions/parse';
import { apiFieldErrorsToUi } from '@/lib/actions/state';
import { updatePostBodyFromApi } from '@/lib/post/api';

import {
  PostCreateBody,
  PostCreateBodySchema,
  PostCreateBodyWithoutPrivacySchema,
  PostResource,
} from '@genkotsu-mt-fall/shared/schemas';

type FieldType<F extends string = string> = Partial<Record<F, string>>;
export type Phase = 'idle' | 'success' | 'error';
type Idle = { ok: true; phase: 'idle'; data?: undefined };

type ActionResult<T, F extends string = string> =
  | { ok: true; phase: Phase; data: T }
  | { ok: false; phase: Phase; error?: string; fields?: FieldType<F> };

export type UpdatePostActionResult =
  | ActionResult<PostResource, keyof PostCreateBody & string>
  | Idle;

export type UpdatePostBound = {
  postId: string;
  privacyJson?: PostCreateBody['privacyJson'];
};

export async function updatePostAction(
  bound: UpdatePostBound,
  _prev: UpdatePostActionResult | undefined,
  formData: FormData,
): Promise<UpdatePostActionResult> {
  const formValidation = parseForm(
    formData,
    PostCreateBodyWithoutPrivacySchema,
  );
  if (!formValidation.ok) {
    return { ok: false, phase: 'error', fields: formValidation.fields };
  }

  const assembledInput: PostCreateBody = {
    ...formValidation.data,
    privacyJson: bound.privacyJson || undefined,
  };

  const inputValidation = parseObject(assembledInput, PostCreateBodySchema);
  if (!inputValidation.ok) {
    return { ok: false, phase: 'error', fields: inputValidation.fields };
  }

  const res = await updatePostBodyFromApi(bound.postId, inputValidation.data);
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
