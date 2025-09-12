'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (v: string) => void
  error?: string
  submitting?: boolean
  onSubmit: () => void
  onCancel: () => void
}

export default function CreateGroupDialog({
  open, onOpenChange,
  name, onNameChange,
  error, submitting,
  onSubmit, onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいグループを作成</DialogTitle>
          <DialogDescription>グループ名を入力して作成します。</DialogDescription>
        </DialogHeader>

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
          >
            作成
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
