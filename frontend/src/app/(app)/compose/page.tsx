'use client'
import { useState } from 'react'

export default function ComposePage() {
  const [text, setText] = useState('')
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">投稿作成</h1>
        <form className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="いまの気持ち…"
            className="h-32 w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <label className="block text-xs text-gray-500">気分(emoji)</label>
              <input className="mt-1 w-full rounded-md border px-2 py-1 text-sm" placeholder="🙂" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <label className="block text-xs text-gray-500">浮き沈み(%)</label>
              <input type="number" min={0} max={100} className="mt-1 w-full rounded-md border px-2 py-1 text-sm" placeholder="50" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <label className="block text-xs text-gray-500">可視性(privacyJson)</label>
            <input className="mt-1 w-full rounded-md border px-2 py-1 text-sm" placeholder='{"public":true}' />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" /> 危機フラグ</label>
            <button type="button" disabled className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white opacity-60">投稿（後でAPI）</button>
          </div>
        </form>
      </div>
    </main>
  )
}
