'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, ExternalLink, Flag, MoreHorizontal } from 'lucide-react'

export function MoreMenu({ onOpen, onCopyLink, onReport }: { onOpen?: () => void; onCopyLink?: () => void; onReport?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 rounded-lg border-gray-300 p-0 text-gray-700"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="text-sm" onClick={onOpen}>
          <ExternalLink className="mr-2 h-4 w-4" />
          投稿を開く
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm" onClick={onCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          リンクをコピー
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm text-red-600 focus:text-red-600" onClick={onReport}>
          <Flag className="mr-2 h-4 w-4" />
          報告する
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
