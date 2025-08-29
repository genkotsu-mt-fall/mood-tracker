'use client'

import type { Emoji } from './types'

export function ReactionCluster({
  reactions,
  myReactions,
  total,
}: {
  reactions: Record<Emoji, number>
  myReactions: Set<Emoji>
  total: number
}) {
  const keys = (Object.keys(reactions) as Emoji[]).filter(e => reactions[e] > 0 || myReactions.has(e))
  return (
    <div className="flex items-center gap-1">
      {keys.map(e => {
        const selected = myReactions.has(e)
        return (
          <span
            key={e}
            title={`${e} × ${reactions[e]}`}
            className={
              'inline-flex h-6 w-6 items-center justify-center rounded-full text-base leading-none ' +
              (selected ? 'border border-gray-300' : '')
            }
          >
            {e}
          </span>
        )
      })}
      <span className="ml-1 text-xs text-gray-600">+ {total}</span>
    </div>
  )
}
