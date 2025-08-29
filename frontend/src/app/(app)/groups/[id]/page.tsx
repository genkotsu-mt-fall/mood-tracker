'use client'
import React, { useState, use } from 'react'


const MEMBERS = Array.from({ length: 5 }).map((_, i) => ({
  id: `m${i + 1}`,
  name: `メンバー ${i + 1}`,
}))

type Props = { params: Promise<{ id: string }> }

export default function GroupDetailPage({ params }: Props) {
  // Next.js 15.5: unwrap params
  const { id } = use(params)
  const [name, setName] = useState(() => `グループ ${id}`)
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-3 text-lg font-semibold text-gray-900">{name}</h1>
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3">
          <label className="block text-xs text-gray-500">グループ名</label>
          <input className="mt-1 w-full rounded-md border px-2 py-1 text-sm" value={name} onChange={(e)=>setName(e.target.value)} />
          <div className="mt-2 text-right text-xs text-gray-500">保存は後でAPI実装</div>
        </div>
        <section className="rounded-xl border border-gray-200 bg-white p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">メンバー</h2>
          <ul className="space-y-2">
            {MEMBERS.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="text-sm">{m.name}</div>
                </div>
                <button disabled className="text-xs text-red-600 opacity-60">削除</button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded-md border px-2 py-1 text-sm" placeholder="ユーザーID" />
            <button disabled className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white opacity-60">追加</button>
          </div>
        </section>
      </div>
    </main>
  )
}
