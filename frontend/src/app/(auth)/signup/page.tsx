'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import FormField from '@/components/auth/FormField';
import PasswordField from '@/components/auth/PasswordField';
import SubmitButton from '@/components/auth/SubmitButton';
import { useActionState } from 'react';
import { signupAction, SignupState } from '../actions';

export default function SignupPage() {
  const [state, formAction] = useActionState<SignupState, FormData>(
    signupAction,
    { ok: false },
  );
  return (
    <>
      <AuthLayout>
        <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            アカウント作成
          </h1>
          <p className="text-sm text-gray-500 mb-6">ようこそ ✨</p>

          <form
            action={formAction}
            aria-describedby="form-error"
            noValidate
            className="space-y-4"
          >
            <FormField
              id="name"
              name="name"
              type="text"
              label="名前（任意）"
              placeholder="山田 太郎"
              autoComplete="name"
              error={state.ok ? undefined : state.fields?.name}
            />
            <FormField
              id="email"
              name="email"
              type="email"
              label="メールアドレス"
              required
              placeholder="email@example.com"
              autoComplete="email"
              error={state.ok ? undefined : state.fields?.email}
            />
            <PasswordField
              id="password"
              name="password"
              label="パスワード"
              autoComplete="new-password"
              error={state.ok ? undefined : state.fields?.password}
            />
            <PasswordField
              id="confirm"
              name="confirm"
              label="パスワード（確認）"
              autoComplete="new-password"
              error={state.ok ? undefined : state.fields?.confirm}
            />

            {!state.ok && state.error ? (
              <>
                <div
                  id="form-error"
                  role="alert"
                  aria-live="polite"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {state.error}
                </div>
              </>
            ) : (
              <>
                <div id="form-error" aria-hidden="true" className="hidden" />
              </>
            )}

            <SubmitButton label="アカウント作成" pendingLabel="作成中..." />
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          すでにアカウントをお持ちですか？{' '}
          <a
            href="/login"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            ログイン
          </a>
        </p>
      </AuthLayout>
    </>
  );
}
