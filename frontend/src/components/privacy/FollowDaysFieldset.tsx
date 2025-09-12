"use client"
import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Plus, ArrowLeftRight, Minus, X, AlertCircle } from 'lucide-react'
import type { PrivacySetting } from '@/lib/privacy/types'

const RANGE_MAX = 3650 // ≒10年

type Props = {
  draft: PrivacySetting
  commit: (next: PrivacySetting) => void
  followDaysError?: string | null
}

export default function FollowDaysFieldset({ draft, commit, followDaysError }: Props) {
  const min = draft.min_follow_days
  const max = draft.max_follow_days

  const sliderValues = useMemo<[number, number]>(() => {
    const a = Math.max(0, min ?? 0)
    const b = typeof max === 'number' ? Math.max(a, max) : RANGE_MAX
    return [a, b]
  }, [min, max])

  const setMin = (v: number | undefined) => commit({ ...draft, min_follow_days: v })
  const setMax = (v: number | undefined) => commit({ ...draft, max_follow_days: v })

  const onMinChange = (v: string) => setMin(v === '' ? undefined : Math.max(0, Number(v)))
  const onMaxChange = (v: string) => setMax(v === '' ? undefined : Math.max(0, Number(v)))

  const decMin = () => setMin(Math.max(0, (min ?? 0) - 1))
  const incMin = () => setMin(Math.max(0, (min ?? 0) + 1))
  const decMax = () => setMax(Math.max(0, (max ?? 0) - 1))
  const incMax = () => setMax(Math.max(0, (max ?? 0) + 1))

  const swap = () => {
    if (typeof min === 'number' && typeof max === 'number' && min > max) {
      setMin(max)
      setMax(min)
    }
  }

  const clearAll = () => {
    setMin(undefined)
    setMax(undefined)
  }

  const quick = (from: number, to?: number) => {
    setMin(from)
    setMax(typeof to === 'number' ? to : undefined)
  }

  return (
    <Card className="border-muted-foreground/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">フォロー日数</CardTitle>
            <CardDescription className="text-xs">フォロー開始からの日数で絞り込み</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => quick(7)}>
                  7日+
                </Button>
              </TooltipTrigger>
              <TooltipContent>最小を7日に設定（上限なし）</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => quick(30)}>
                  30日+
                </Button>
              </TooltipTrigger>
              <TooltipContent>最小を30日に設定（上限なし）</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => quick(90)}>
                  90日+
                </Button>
              </TooltipTrigger>
              <TooltipContent>最小を90日に設定（上限なし）</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={swap} aria-label="最小と最大を入れ替え">
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>最小/最大が逆のときに入れ替え</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={clearAll} aria-label="クリア">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>条件をクリア</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 入力（最小/最大） */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="min-follow-days" className="mb-1 block text-xs text-muted-foreground">
              最小フォロー日数
            </Label>
            <div className="relative">
              <Input
                id="min-follow-days"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className="pr-10"
                value={min ?? ''}
                onChange={(e) => onMinChange(e.target.value)}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                日
              </span>
            </div>
            <div className="mt-1 flex gap-1">
              <Button size="icon" variant="outline" onClick={decMin} aria-label="最小を1日減らす">
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" onClick={incMin} aria-label="最小を1日増やす">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="max-follow-days" className="mb-1 block text-xs text-muted-foreground">
              最大フォロー日数
            </Label>
            <div className="relative">
              <Input
                id="max-follow-days"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className="pr-10"
                value={max ?? ''}
                onChange={(e) => onMaxChange(e.target.value)}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                日
              </span>
            </div>
            <div className="mt-1 flex gap-1">
              <Button size="icon" variant="outline" onClick={decMax} aria-label="最大を1日減らす">
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" onClick={incMax} aria-label="最大を1日増やす">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 範囲スライダー */}
        <div className="pt-1">
          <Slider
            value={sliderValues}
            min={0}
            max={RANGE_MAX}
            step={1}
            onValueChange={([a, b]) => {
              // 右端 = 上限なし
              commit({
                ...draft,
                min_follow_days: a,
                max_follow_days: b >= RANGE_MAX ? undefined : b,
              })
            }}
            aria-label="フォロー日数の範囲"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{(min ?? 0).toLocaleString()}日</span>
            <span>{typeof max === 'number' ? `${max.toLocaleString()}日` : '上限なし'}</span>
          </div>
        </div>

        {/* エラー表示 */}
        {followDaysError && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" />
            {followDaysError}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
