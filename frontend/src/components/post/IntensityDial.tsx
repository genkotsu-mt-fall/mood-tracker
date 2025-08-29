'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { conicBg, clamp } from './utils'

export function IntensityDial({ pct, emoji }: { pct?: number; emoji?: string }) {
  if (pct == null && !emoji) return null
  const clamped = clamp(pct ?? 0, 0, 100)
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative h-10 w-10 shrink-0 rounded-full"
            style={{ background: conicBg(clamped) }}
            aria-label={`intensity ${clamped}%`}
          >
            <div className="absolute inset-0 m-1 grid place-items-center rounded-full bg-white text-base">
              <span>{emoji}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          強さ {clamped}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
