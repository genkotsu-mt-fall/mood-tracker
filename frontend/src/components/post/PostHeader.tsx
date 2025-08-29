'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IntensityDial } from './IntensityDial'
import { formatRelative } from './utils'

export function PostHeader({
  name,
  avatarUrl,
  createdAt,
  emoji,
  intensity,
  // MoreMenu関連props削除
}: {
  name: string
  avatarUrl?: string
  createdAt: string
  emoji?: string
  intensity?: number
}) {
  return (
    <div className="mb-2 flex items-start gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt="" />
        <AvatarFallback className="bg-gray-200 text-gray-600">
          {name?.[0]?.toUpperCase() ?? 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{formatRelative(createdAt)}</div>
          </div>
          <div className="flex items-center gap-2">
            <IntensityDial pct={intensity} emoji={emoji} />
            {/* MoreMenuを削除 */}
          </div>
        </div>
      </div>
    </div>
  )
}
