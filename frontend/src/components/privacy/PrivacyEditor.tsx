"use client"

import AudienceSection from './AudienceSection'
import { useMemo, useState, useId } from 'react'
import type { PrivacySetting, DeviceType } from '@/lib/privacy/types'
import { normalizePrivacySetting, localDateTimeToISO } from '@/lib/privacy/utils'
import type { Option } from '@/lib/common/types'
import {
  Plus,
  Info,
  ListChecks,
  GitMerge,
  Globe,
  Users,
  Clock,
  SlidersHorizontal,
  MessageSquareMore,
  RotateCcw,
  Minus,
} from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ViewableTimeRangeField from './ViewableTimeRangeField'
import FollowDaysFieldset from './FollowDaysFieldset'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

type Props = {
  value?: PrivacySetting
  onChange: (next: PrivacySetting | undefined) => void
  userOptions?: Option[]
  groupOptions?: Option[]
  onHoverGroupChange?: (groupId: string | null) => void
  /** クリックで親にダイアログ表示を依頼し、作成されたグループを返す */
  onRequestCreateGroup?: () => Promise<Option | void>
}

export default function PrivacyEditor({
  value,
  onChange,
  userOptions = [],
  groupOptions = [],
  onHoverGroupChange,
  onRequestCreateGroup,
}: Props) {
  // 内部編集用のドラフト
  const [draft, setDraft] = useState<PrivacySetting>(value ?? {})
  const uid = useId()
  const gmAnyId = `${uid}-gm-any`
  const gmAllId = `${uid}-gm-all`

  // min/max の相関チェック
  const followDaysError = useMemo(() => {
    if (draft.min_follow_days === undefined || draft.max_follow_days === undefined) return ''
    return draft.min_follow_days > draft.max_follow_days
      ? 'min_follow_days は max_follow_days 以下にしてください'
      : ''
  }, [draft.min_follow_days, draft.max_follow_days])

  // 変更時に normalize して親に返す
  const commit = (next: PrivacySetting) => {
    setDraft(next)
    onChange(normalizePrivacySetting(next))
  }

  // 配列トグル
  function toggleInArray<T>(arr: T[] | undefined, v: T): T[] {
    const a = arr ?? []
    return a.includes(v) ? a.filter((x) => x !== v) : [...a, v]
  }

  const onDeviceToggle = (device: DeviceType) =>
    commit({ ...draft, device_types: toggleInArray(draft.device_types, device) })

  // === コメントアクティビティ（リッチ版）用ヘルパ ===
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

  // 既存フラグ ↔ 単一選択の相互変換
  // ...existing code...

  return (
    <Tabs defaultValue="audience" className="w-full">
      {/* タブバー（横スクロール可） */}
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="audience" className="gap-1">
          <Globe className="h-4 w-4" />
          公開範囲
        </TabsTrigger>
        <TabsTrigger value="groups" className="gap-1">
          <Users className="h-4 w-4" />
          グループ
        </TabsTrigger>
        <TabsTrigger value="time" className="gap-1">
          <Clock className="h-4 w-4" />
          時刻・期間
        </TabsTrigger>
        <TabsTrigger value="advanced" className="gap-1">
          <SlidersHorizontal className="h-4 w-4" />
          詳細
        </TabsTrigger>
      </TabsList>

      {/* --- 公開範囲 + 許可/除外ユーザー --- */}
      <TabsContent value="audience" className="mt-4 space-y-4">
        <AudienceSection draft={draft} userOptions={userOptions} onChange={commit} />
      </TabsContent>

      {/* --- グループ --- */}
      <TabsContent value="groups" className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 許可グループ */}
          <div>
            <div className="mb-1 text-xs text-gray-500">許可グループ</div>
            <ul className="w-full rounded-md border text-sm max-h-56 overflow-auto divide-y">
              {groupOptions.map((g) => {
                const checked = (draft.allow_groups ?? []).includes(g.id)
                return (
                  <li
                    key={g.id}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-50 transition"
                    onMouseEnter={() => onHoverGroupChange?.(g.id)}
                    onMouseLeave={() => onHoverGroupChange?.(null)}
                    onFocus={() => onHoverGroupChange?.(g.id)}
                    onBlur={() => onHoverGroupChange?.(null)}
                    tabIndex={0}
                    onClick={() =>
                      commit({ ...draft, allow_groups: toggleInArray(draft.allow_groups, g.id) })
                    }
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={(e) =>
                        commit({
                          ...draft,
                          allow_groups: e.target.checked
                            ? [...(draft.allow_groups ?? []), g.id]
                            : (draft.allow_groups ?? []).filter((id) => id !== g.id),
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="truncate">{g.label}</span>
                  </li>
                )
              })}

              {/* 「新しいグループを作成」→ 親にダイアログ要求 */}
              <li
                className="m-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-3 py-2 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                onMouseEnter={() => onHoverGroupChange?.(null)}
                onMouseLeave={() => onHoverGroupChange?.(null)}
                onClick={async () => {
                  if (!onRequestCreateGroup) return
                  const created = await onRequestCreateGroup()
                  if (created && 'id' in created && 'label' in created) {
                    commit({
                      ...draft,
                      allow_groups: toggleInArray(draft.allow_groups, created.id),
                    })
                    onHoverGroupChange?.(created.id)
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">新しいグループを作成</span>
              </li>
            </ul>
          </div>

          {/* グループ判定 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="text-xs text-gray-500">グループ判定</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md p-1 hover:bg-muted"
                    aria-label="any/all の違いについて"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="font-medium mb-1">any（どれか1つ所属）</p>
                  <p className="mb-2">指定したグループのうち、いずれか1つに所属していればOK。</p>
                  <p className="font-medium mb-1">all（全て所属）</p>
                  <p>指定したグループすべてに所属している必要があります。</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <RadioGroup
              value={draft.group_visibility_mode ?? 'any'}
              onValueChange={(v) => commit({ ...draft, group_visibility_mode: v as 'any' | 'all' })}
              className="grid grid-cols-2 gap-3"
            >
              {/* any */}
              <Label htmlFor={gmAnyId} className="cursor-pointer">
                <RadioGroupItem id={gmAnyId} value="any" className="sr-only peer" />
                <div
                  className="
                    flex items-center gap-2 rounded-xl border p-3 text-sm
                    transition-all hover:shadow-sm
                    peer-data-[state=checked]:border-primary
                    peer-data-[state=checked]:bg-primary/5
                    peer-data-[state=checked]:ring-2
                    peer-data-[state=checked]:ring-primary/30
                  "
                >
                  <ListChecks className="h-4 w-4" />
                  <div>
                    <div className="font-medium">any</div>
                    <div className="text-xs text-muted-foreground">どれか1つ所属で可</div>
                  </div>
                </div>
              </Label>

              {/* all */}
              <Label htmlFor={gmAllId} className="cursor-pointer">
                <RadioGroupItem id={gmAllId} value="all" className="sr-only peer" />
                <div
                  className="
                    flex items-center gap-2 rounded-xl border p-3 text-sm
                    transition-all hover:shadow-sm
                    peer-data-[state=checked]:border-primary
                    peer-data-[state=checked]:bg-primary/5
                    peer-data-[state=checked]:ring-2
                    peer-data-[state=checked]:ring-primary/30
                  "
                >
                  <GitMerge className="h-4 w-4" />
                  <div>
                    <div className="font-medium">all</div>
                    <div className="text-xs text-muted-foreground">すべて所属が必要</div>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </div>
      </TabsContent>

      {/* --- 時刻・期間（フォロー日数 / 閲覧可能時間帯 / 公開期間） --- */}
      <TabsContent value="time" className="mt-4 space-y-6">
        {/* フォロー日数（リッチ版） */}
        <FollowDaysFieldset
          draft={draft}
          commit={commit}
          followDaysError={followDaysError || null}
        />

        {/* 閲覧可能時間帯（リッチUI版） */}
        <ViewableTimeRangeField
          value={draft.viewable_time_range}
          onChange={(next) => commit({ ...draft, viewable_time_range: next })}
          // allowOvernight
        />

        {/* 公開期間 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-1 text-xs text-gray-500">表示開始（ローカル）</div>
            <input
              type="datetime-local"
              className="w-full rounded-md border px-2 py-1 text-sm"
              onChange={(e) => commit({ ...draft, visible_after: localDateTimeToISO(e.target.value) })}
            />
            <p className="mt-1 text-[11px] text-gray-500">※ 送信時は ISO8601 に変換</p>
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-500">表示終了（ローカル）</div>
            <input
              type="datetime-local"
              className="w-full rounded-md border px-2 py-1 text-sm"
              onChange={(e) => commit({ ...draft, visible_until: localDateTimeToISO(e.target.value) })}
            />
            <p className="mt-1 text-[11px] text-gray-500">※ 未来日時のみ許可（サーバで検証）</p>
          </div>
        </div>
      </TabsContent>

      {/* --- 詳細（コメントアクティビティ / デバイス / クリア & プレビュー） --- */}
      <TabsContent value="advanced" className="mt-4 space-y-6">
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
      </TabsContent>
    </Tabs>
  )
}
