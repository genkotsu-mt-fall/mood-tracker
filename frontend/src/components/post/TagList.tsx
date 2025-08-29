'use client'

import { Badge } from '@/components/ui/badge'

export function TagList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null
  return (
    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
      {tags.map(t => (
        <Badge
          key={t}
          variant="secondary"
          className="rounded-full border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50"
        >
          {t}
        </Badge>
      ))}
    </div>
  )
}
