'use client'

import type { DragEvent } from 'react'
import type { Option } from '@/lib/common/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

type Props = {
  /** 開閉（親で制御） */
  open: boolean
  onOpenChange: (open: boolean) => void

  /** グループ名（親で制御） */
  name: string
  onNameChange: (v: string) => void

  /** 候補ユーザー一覧（例: フォロワー） */
  users: Option[]
  /** 現在選択中のユーザーID（親で制御） */
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void

  /** 見た目用のエラー＆送信中（親で制御） */
  error?: string
  submitting?: boolean

  /** ボタン押下イベント（親へ通知） */
  onSubmit: () => void
  onCancel: () => void
}

export default function CreateGroupDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  users,
  selectedIds,
  onSelectedIdsChange,
  error,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const selectedSet = new Set(selectedIds)
  const available = users.filter((u) => !selectedSet.has(u.id))
  const selected = users.filter((u) => selectedSet.has(u.id))

  const addMember = (id: string) => {
    if (!selectedSet.has(id)) onSelectedIdsChange([...selectedIds, id])
  }
  const removeMember = (id: string) => {
    if (selectedSet.has(id)) onSelectedIdsChange(selectedIds.filter((x) => x !== id))
  }

  // --- Drag & Drop（最小実装） ---
  const onDragStart = (e: DragEvent<HTMLLIElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
  }
  const allowDrop = (e: DragEvent<HTMLDivElement>) => e.preventDefault()
  const dropToSelected = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) addMember(id)
  }
  const dropToAvailable = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) removeMember(id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいグループを作成</DialogTitle>
          <DialogDescription>
            グループ名を入力し、右側へドラッグまたは「追加」ボタンでメンバーを選びます。
          </DialogDescription>
        </DialogHeader>

        {/* グループ名 */}
        <div className="mt-2">
          <input
            autoFocus
            type="text"
            placeholder="例: Family, Work..."
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSubmit()
              } else if (e.key === 'Escape') {
                onCancel()
              }
            }}
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>

        {/* ユーザー選択（DnD + クリック） */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* 候補（左） */}
          <div
            className="rounded-lg border bg-white"
            onDragOver={allowDrop}
            onDrop={dropToAvailable}
          >
            <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-gray-600">
              <span>候補</span>
              <span>{available.length} 人</span>
            </div>
            <ul className="max-h-56 overflow-auto p-2">
              {available.length === 0 && (
                <li className="px-2 py-6 text-center text-xs text-gray-500">候補はありません</li>
              )}
              {available.map((u) => (
                <li
                  key={u.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, u.id)}
                  className="mb-2 flex cursor-grab items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 active:cursor-grabbing"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="text-sm font-semibold">{u.label}</div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => addMember(u.id)}
                    title="追加"
                  >
                    追加
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 選択（右） */}
          <div
            className="rounded-lg border bg-white"
            onDragOver={allowDrop}
            onDrop={dropToSelected}
          >
            <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-gray-600">
              <span>追加するメンバー</span>
              <span>{selected.length} 人</span>
            </div>
            <ul className="max-h-56 overflow-auto p-2">
              {selected.length === 0 && (
                <li className="px-2 py-6 text-center text-xs text-gray-500">
                  左からドラッグして追加
                </li>
              )}
              {selected.map((u) => (
                <li
                  key={u.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, u.id)}
                  className="mb-2 flex cursor-grab items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-2 active:cursor-grabbing"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-200" />
                    <div className="text-sm font-semibold text-blue-700">{u.label}</div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-gray-600 hover:underline"
                    onClick={() => removeMember(u.id)}
                    title="削除"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={onCancel}
            disabled={submitting}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={onSubmit}
            disabled={submitting || name.trim().length === 0}
            title={name.trim().length === 0 ? 'グループ名を入力してください' : '作成'}
          >
            作成
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
