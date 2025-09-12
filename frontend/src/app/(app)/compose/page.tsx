'use client'

import { useState } from 'react'
import EmojiPickerField from '@/components/emoji/EmojiPickerField'
import PrivacyEditor from '@/components/privacy/PrivacyEditor'
import type { PrivacySetting } from '@/lib/privacy/types'
import type { Option } from '@/lib/common/types'
import CreateGroupDialog from '@/components/privacy/CreateGroupDialog'
import { useCreateGroupDialog } from '@/hooks/useCreateGroupDialog'

export default function ComposePage() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [privacy, setPrivacy] = useState<PrivacySetting | undefined>(undefined)

  // 候補は state 化（新規作成で即反映）
  const [groupOptions, setGroupOptions] = useState<Option[]>([
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', label: 'Family' },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', label: 'Work' },
  ])
  const USER_OPTIONS: Option[] = [
    { id: '11111111-1111-1111-1111-111111111111', label: 'Alice' },
    { id: '22222222-2222-2222-2222-222222222222', label: 'Bob' },
  ]

  // 作成ロジック（将来 API に置き換え）
  async function createGroup(name: string): Promise<Option> {
    const created: Option = { id: crypto.randomUUID(), label: name.trim() }
    setGroupOptions((prev) => [...prev, created])
    return created
  }

  // CreateGroupDialog用の選択状態
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ダイアログ状態・Promise解決は Hook に委譲
  const {
    open, setOpen,
    name, setName,
    error, setError,
    submitting,
    requestCreateGroup,
    handleSubmit,
    handleClose,
  } = useCreateGroupDialog({ onCreate: createGroup })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl p-4">
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
              <EmojiPickerField value={mood} onChange={setMood} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <label className="block text-xs text-gray-500">浮き沈み(%)</label>
              <input
                type="number" min={0} max={100}
                className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                placeholder="50"
              />
            </div>
          </div>

          {/* 可視性（privacyJson） */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <label className="block text-xs text-gray-500">可視性(privacyJson)</label>
            <PrivacyEditor
              value={privacy}
              onChange={setPrivacy}
              userOptions={USER_OPTIONS}
              groupOptions={groupOptions}
              onRequestCreateGroup={requestCreateGroup} // ★ クリックでダイアログを要求
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4" /> センシティブ
            </label>
            <button
              type="button" disabled
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white opacity-60"
              onClick={() => console.log({ text, mood, privacy })}
            >
              投稿（後でAPI）
            </button>
          </div>
        </form>
      </div>

      {/* 新規グループ作成ダイアログ（見た目だけ担当） */}
      <CreateGroupDialog
        open={open}
        onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
        name={name}
        onNameChange={(v) => { setName(v); if (error) setError('') }}
        error={error}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        users={USER_OPTIONS}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />
    </main>
  )
}
