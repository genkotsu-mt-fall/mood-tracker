'use server';

import { parseForm } from '@/lib/actions/parse';
import { ActionState, apiFieldErrorsToUi } from '@/lib/actions/state';
import { authLogin, authSignup } from '@/lib/auth/api';
import {
  setAccessTokenCookie,
  clearAccessTokenCookie,
} from '@/lib/auth/cookies';
import { consumeSignedReturnTo } from '@/lib/auth/returnToCookie';
import {
  AuthLoginBody,
  AuthLoginBodySchema,
  AuthSignupBody,
  AuthSignupBodySchema,
} from '@genkotsu-mt-fall/shared/schemas';

import { redirect, RedirectType } from 'next/navigation';

export type LoginState = ActionState<keyof AuthLoginBody & string>;
export type SignupState = ActionState<keyof AuthSignupBody & string>;

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const parsed = parseForm(formData, AuthLoginBodySchema);
  if (!parsed.ok) return { ok: false, fields: parsed.fields };

  const { email, password } = parsed.data;

  const r = await authLogin(email, password);

  if (!r.ok) {
    return { ok: false, error: r.message };
  }

  await setAccessTokenCookie(r.data.accessToken);

  const redirectTo = await consumeSignedReturnTo();
  redirect(redirectTo ?? '/feed', RedirectType.replace);
  return { ok: true };
}

export async function signupAction(
  _prevState: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  const parsed = parseForm(formData, AuthSignupBodySchema);
  if (!parsed.ok) return { ok: false, fields: parsed.fields };

  const { name, email, password } = parsed.data;

  // 1) サインアップ
  const s = await authSignup({ email, password, ...(name ? { name } : {}) });
  if (!s.ok) {
    return {
      ok: false,
      error: s.message,
      fields: apiFieldErrorsToUi(s.fields),
    };
  }

  // 2) 自動ログイン（失敗しても成功導線へ）
  const l = await authLogin(email, password);
  if (!l.ok) {
    redirect('/login?just_signed_up=1', RedirectType.replace);
    return { ok: true };
  }

  await setAccessTokenCookie(l.data.accessToken);
  redirect('/feed', RedirectType.replace);
  return { ok: true };
}

/**
 * ログアウト：アクセストークン Cookie を削除して /login へ
 * UI 側は <form action={logoutAction}> で呼ぶのが一番簡単です。
 */
export async function logoutAction(): Promise<void> {
  await clearAccessTokenCookie();
  redirect('/login', RedirectType.replace);
}
