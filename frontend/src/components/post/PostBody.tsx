'use client'

import { useMemo, useState } from 'react'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function PostBody({ body, expanded, onToggle, threshold = 180, isEditable, onSaveEdit }: {
  body: string
  expanded: boolean
  onToggle: () => void
  threshold?: number
  isEditable?: boolean
  onSaveEdit?: (newBody: string) => void
}) {
  const display = useMemo(() => {
    if (expanded) return body
    return body.length > threshold ? body.slice(0, threshold) + '…' : body
  }, [expanded, body, threshold])

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(body)

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }
  const handleSave = () => {
    setIsEditing(false)
    if (editValue !== body && typeof onSaveEdit === 'function') {
      onSaveEdit(editValue)
    }
  }
  const handleCancel = () => {
    setEditValue(body)
    setIsEditing(false)
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full rounded border p-2 text-sm"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            rows={expanded ? 6 : 3}
          />
          <div className="flex gap-2 mt-1">
            <button className="px-3 py-1 rounded bg-blue-500 text-white" onClick={handleSave}>保存</button>
            <button className="px-3 py-1 rounded bg-gray-200" onClick={handleCancel}>キャンセル</button>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900 flex items-center">
          <span>{display}</span>
          {isEditable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="inline-flex items-center text-gray-400 hover:text-blue-500 ml-1"
                  onClick={handleEditClick}
                  aria-label="編集"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Pencil2Icon width={16} height={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>編集する</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      {!isEditing && body.length > threshold && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 rounded text-xs text-gray-600 underline underline-offset-2 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          {expanded ? '閉じる' : '続きを読む'}
        </button>
      )}
    </div>
  )
}
