import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  MessageSquareMore,
  RotateCcw,
  Minus,
  Info,
  Plus,
} from 'lucide-react'
import type { PrivacySetting } from '@/lib/privacy/types'
import { normalizePrivacySetting } from '@/lib/privacy/utils'
import React from 'react'

type Props = {
  draft: PrivacySetting
  commit: (next: PrivacySetting) => void
  setDraft: React.Dispatch<React.SetStateAction<PrivacySetting>>
  onChange: (next: PrivacySetting | undefined) => void
}

export default function AdvancedSection({ draft, commit, setDraft, onChange }: Props) {
  const withinDays = draft.comment_activity_filter?.within_days ?? ''
  const minComments = draft.comment_activity_filter?.min_comments ?? ''

  const setWithinDays = (v: number | undefined) =>
    commit({
      ...draft,
      comment_activity_filter: {
        within_days: v,
        min_comments: draft.comment_activity_filter?.min_comments,
      },
    })

  const setMinComments = (v: number | undefined) =>
    commit({
      ...draft,
      comment_activity_filter: {
        within_days: draft.comment_activity_filter?.within_days,
        min_comments: v,
      },
    })

  return (
    <>
      {/* コメントアクティビティ（リッチ版） */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2">
            <MessageSquareMore className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">コメントアクティビティ</CardTitle>
              <CardDescription className="text-xs">
                直近日数と最小コメント数でしぼり込み
              </CardDescription>
            </div>
          </div>

          {/* クリア */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => commit({ ...draft, comment_activity_filter: undefined })}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            リセット
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 直近日数 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">直近日数</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  指定した「日数」より新しいコメントがある投稿だけを対象にします。
                  0 または空にすると無制限。
                </TooltipContent>
              </Tooltip>
            </div>

            {/* プリセット */}
            <div className="flex flex-wrap gap-2">
              {[7, 30, 90].map((d) => (
                <Button
                  key={d}
                  type="button"
                  size="sm"
                  variant={withinDays === d ? "default" : "secondary"}
                  onClick={() => setWithinDays(d)}
                  className="rounded-full"
                >
                  直近{d}日
                </Button>
              ))}
              <Button
                type="button"
                size="sm"
                variant={withinDays === "" || withinDays === 0 ? "default" : "outline"}
                onClick={() => setWithinDays(undefined)}
                className="rounded-full"
              >
                指定なし
              </Button>
            </div>

            {/* スライダー + 現在値 */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Slider
                  value={[Number(withinDays) || 0]}
                  min={0}
                  max={365}
                  step={1}
                  onValueChange={(vals) => setWithinDays(vals[0] === 0 ? undefined : vals[0])}
                />
              </div>
              <div className="w-28">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setWithinDays(
                        withinDays === "" || Number(withinDays) <= 1
                          ? undefined
                          : Number(withinDays) - 1
                      )
                    }
                    aria-label="日数を1減らす"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  {/* 単位付きインプット */}
                  <div className="relative w-full">
                    <Input
                      type="number"
                      min={0}
                      value={withinDays}
                      onChange={(e) =>
                        setWithinDays(e.target.value === "" ? undefined : Number(e.target.value))
                      }
                      className="pr-8"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      日
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setWithinDays(
                        withinDays === "" ? 1 : Math.min(365, Number(withinDays) + 1)
                      )
                    }
                    aria-label="日数を1増やす"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 最小コメント数 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">最小コメント数</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  この件数以上のコメントが付いた投稿のみ対象。0 または空で制限なし。
                </TooltipContent>
              </Tooltip>
            </div>

            {/* プリセット */}
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 20].map((n) => (
                <Button
                  key={n}
                  type="button"
                  size="sm"
                  variant={minComments === n ? "default" : "secondary"}
                  onClick={() => setMinComments(n)}
                  className="rounded-full"
                >
                  {n}件〜
                </Button>
              ))}
              <Button
                type="button"
                size="sm"
                variant={minComments === "" || minComments === 0 ? "default" : "outline"}
                onClick={() => setMinComments(undefined)}
                className="rounded-full"
              >
                指定なし
              </Button>
            </div>

            {/* スライダー + 単位付きインプット + ステッパー */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Slider
                  value={[Number(minComments) || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setMinComments(vals[0] === 0 ? undefined : vals[0])}
                />
              </div>
              <div className="w-32">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setMinComments(
                        minComments === "" || Number(minComments) <= 1
                          ? undefined
                          : Number(minComments) - 1
                      )
                    }
                    aria-label="件数を1減らす"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="relative w-full">
                    <Input
                      type="number"
                      min={0}
                      value={minComments}
                      onChange={(e) =>
                        setMinComments(e.target.value === "" ? undefined : Number(e.target.value))
                      }
                      className="pr-8"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      件
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setMinComments(minComments === "" ? 1 : Math.min(100, Number(minComments) + 1))
                    }
                    aria-label="件数を1増やす"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 右下：クリア＆プレビュー */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setDraft({})
            onChange(undefined)
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          クリア
        </button>
        <details className="text-xs">
          <summary className="cursor-pointer select-none text-gray-500">JSONプレビュー</summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-gray-50 p-2">
{JSON.stringify(normalizePrivacySetting(draft) ?? {}, null, 2)}
          </pre>
        </details>
      </div>
    </>
  )
}
