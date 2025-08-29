'use client'
import { useState } from 'react'

export default function SettingsProfilePage() {
  const [name, setName] = useState('あなた')
  const [bio, setBio] = useState('自己紹介文(仮)')
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">プロフィール編集</h1>
        <form className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <label className="block text-xs text-gray-500">名前</label>
            <input className="mt-1 w-full rounded-md border px-2 py-1 text-sm" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <label className="block text-xs text-gray-500">自己紹介</label>
            <textarea className="mt-1 h-24 w-full rounded-md border p-2 text-sm" value={bio} onChange={(e)=>setBio(e.target.value)} />
          </div>
          <button type="button" disabled className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-60">保存（後でAPI）</button>
        </form>
      </div>
    </main>
  )
}
