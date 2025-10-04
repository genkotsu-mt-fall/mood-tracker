'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '../actions';
import AuthLayout from '@/components/auth/AuthLayout';
import FormField from '@/components/auth/FormField';
import PasswordField from '@/components/auth/PasswordField';
import SubmitButton from '@/components/auth/SubmitButton';
import { useEffect } from 'react';

// TODO: ログイン失敗時に入力が消える問題を修正する
export default function ClientLoginForm({
  justSignedUp,
}: {
  justSignedUp: boolean;
}) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    { ok: true },
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('next')) {
      window.history.replaceState(null, '', '/login');
    }
  }, []);

  return (
    <AuthLayout>
      <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">ログイン</h1>
        <p className="text-sm text-gray-500 mb-4">おかえりなさい 👋</p>

        {justSignedUp && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            アカウントを作成しました。メールアドレスとパスワードでログインしてください。
          </div>
        )}

        <form
          action={formAction}
          aria-describedby="form-error"
          noValidate
          className="space-y-4"
        >
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
            autoComplete="current-password"
            error={state.ok ? undefined : state.fields?.password}
          />

          {!state.ok && state.error ? (
            <div
              id="form-error"
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {state.error}
            </div>
          ) : (
            <div id="form-error" aria-hidden="true" className="hidden" />
          )}

          <SubmitButton label="ログイン" pendingLabel="ログイン中..." />
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        続行することで、
        <a
          href="/terms"
          className="underline underline-offset-2 hover:text-gray-700"
        >
          利用規約
        </a>
        と
        <a
          href="/privacy"
          className="underline underline-offset-2 hover:text-gray-700"
        >
          プライバシーポリシー
        </a>
        に同意したものとみなされます。
      </p>
    </AuthLayout>
  );
}
