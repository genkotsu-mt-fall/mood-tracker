'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { EMOJIS, Emoji } from './types'

export function EmojiReactPicker({ myReactions, onToggle }: { myReactions: Set<Emoji>; onToggle: (emoji: Emoji) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-gray-300 bg-white text-xs text-gray-900 hover:bg-gray-50"
          aria-label="絵文字で反応する"
        >
          <Smile className="mr-1 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-2">
        <div className="grid grid-cols-9 gap-1">
          {EMOJIS.map(e => {
            const selected = myReactions.has(e)
            return (
              <button
                key={e}
                type="button"
                onClick={() => onToggle(e)}
                className={
                  'grid h-7 w-7 place-items-center rounded-full ' +
                  (selected ? '' : 'hover:bg-gray-100')
                }
                aria-pressed={selected}
                aria-label={`react ${e}`}
              >
                {e}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
