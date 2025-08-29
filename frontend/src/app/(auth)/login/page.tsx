'use client'

import { useFormStatus } from "react-dom"
import { loginAction, LoginState } from "../actions"
import { useActionState } from "react"

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, { ok: false, error: "" })

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Log in</h1>
          <p className="text-sm text-gray-500 mb-6">welcome back 👋</p>

          <form
            action={formAction}
            aria-describedby="form-error"
            noValidate
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                autoComplete="email"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            {/* エラーメッセージ（ある時だけ表示） */}
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

            <SubmitButton />
          </form>
        </div>

        {/* 補助リンク（任意で） */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing you agree to our&nbsp;
          <a href="/terms" className="underline underline-offset-2 hover:text-gray-700">Terms</a>
          &nbsp;and&nbsp;
          <a href="/privacy" className="underline underline-offset-2 hover:text-gray-700">Privacy Policy</a>.
        </p>
      </div>
    </main>
  )
}

function SubmitButton(){
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
    >
      {pending ? "Logging in..." : "Log in"}
    </button>
  )
}
