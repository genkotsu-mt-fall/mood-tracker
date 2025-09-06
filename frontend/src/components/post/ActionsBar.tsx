'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Heart, MessageCircle, Repeat2 } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { EmojiReactPicker } from './EmojiReactPicker'
import type { Emoji } from './types'
import { MoreMenu } from './MoreMenu'

export function ActionsBar({
  comments = 0,
  reposts = 0,
  likeCount,
  liked,
  onToggleLike,
  onComment,
  onRepost,
  myReactions,
  onToggleEmoji,
  onOpen,
  onCopyLink,
  onReport,
  isEditable,
  onDelete,
}: {
  comments?: number
  reposts?: number
  likeCount: number
  liked: boolean
  onToggleLike: () => void
  onComment?: () => void
  onRepost?: () => void
  myReactions: Set<Emoji>
  onToggleEmoji: (emoji: Emoji) => void
  onOpen?: () => void
  onCopyLink?: () => void
  onReport?: () => void
  isEditable?: boolean
  onDelete?: () => void
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onComment}
              className="rounded-lg border-gray-300 bg-white text-xs text-gray-900 hover:bg-gray-50"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              {comments}
            </Button>
          </TooltipTrigger>
          <TooltipContent>コメント</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={liked ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleLike}
              className={
                liked
                  ? 'rounded-lg bg-gray-900 text-white'
                  : 'rounded-lg border-gray-300 bg-white text-xs text-gray-900 hover:bg-gray-50'
              }
              aria-pressed={liked}
            >
              <Heart className={`mr-1 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{liked ? 'いいね済み' : 'いいね'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRepost}
              className="rounded-lg border-gray-300 bg-white text-xs text-gray-900 hover:bg-gray-50"
            >
              <Repeat2 className="mr-1 h-4 w-4" />
              {reposts}
            </Button>
          </TooltipTrigger>
          <TooltipContent>リポスト</TooltipContent>
        </Tooltip>

        <EmojiReactPicker myReactions={myReactions} onToggle={onToggleEmoji} />
        {isEditable && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="rounded-lg border-gray-300 bg-white text-xs text-gray-900 hover:bg-red-50 ml-1"
                aria-label="投稿を削除"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>投稿を削除</TooltipContent>
          </Tooltip>
        )}
        <MoreMenu onOpen={onOpen} onCopyLink={onCopyLink} onReport={onReport} />
      </TooltipProvider>
    </div>
  )
}
