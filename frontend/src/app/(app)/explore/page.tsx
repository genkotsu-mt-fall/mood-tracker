'use client'
import { useState } from 'react'

export default function ExplorePage() {
  const [q, setQ] = useState('')
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">探索</h1>
        <div className="mb-3 flex gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="ユーザーや投稿を検索" className="flex-1 rounded-md border px-3 py-2 text-sm" />
          <button disabled className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white opacity-60">検索</button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button className="rounded-full border border-gray-300 bg-white px-3 py-1">ユーザー</button>
          <button className="rounded-full border border-gray-300 bg-white px-3 py-1">投稿</button>
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          検索結果は後で実装
        </div>
      </div>
    </main>
  )
}
