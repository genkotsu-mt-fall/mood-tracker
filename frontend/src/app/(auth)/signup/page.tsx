'use client'

import { useState } from "react"

export default function SignupPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")
    const confirm = String(fd.get("confirm") || "")

    if (!email || !password || !confirm) {
      setError("Missing fields")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    // UIデモ用：実際の送信は行わない
    setPending(true)
    setTimeout(() => setPending(false), 800)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">welcome ✨</p>

          <form onSubmit={handleSubmit} aria-describedby="form-error" noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (optional)</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Taro Yamada"
                autoComplete="name"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            {error ? (
              <div id="form-error" role="alert" aria-live="polite" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <div id="form-error" aria-hidden="true" className="hidden" />
            )}

            <SubmitButton pending={pending} />
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-2 hover:text-gray-700">Log in</a>
        </p>
      </div>
    </main>
  )
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
    >
      {pending ? "Creating..." : "Create account"}
    </button>
  )
}
