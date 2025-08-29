'use client'

import { useMemo } from 'react'

export function PostBody({ body, expanded, onToggle, threshold = 180 }: {
  body: string
  expanded: boolean
  onToggle: () => void
  threshold?: number
}) {
  const display = useMemo(() => {
    if (expanded) return body
    return body.length > threshold ? body.slice(0, threshold) + '…' : body
  }, [expanded, body, threshold])

  return (
    <div>
      <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900">{display}</div>
      {body.length > threshold && (
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
