"use client"

import UserMultiSelectLite from './UserMultiSelectLite'
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
  UserCheck,
  Clock,
  SlidersHorizontal,
} from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ViewableTimeRangeField from './ViewableTimeRangeField'
import FollowDaysFieldset from './FollowDaysFieldset'

type Props = {
  value?: PrivacySetting
  onChange: (next: PrivacySetting | undefined) => void
  userOptions?: Option[]
  groupOptions?: Option[]
  onHoverGroupChange?: (groupId: string | null) => void
  /** クリックで親にダイアログ表示を依頼し、作成されたグループを返す */
  onRequestCreateGroup?: () => Promise<Option | void>
}

type Audience = 'public' | 'followers' | 'mutuals'

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
  const audPublicId = `${uid}-aud-public`
  const audFollowersId = `${uid}-aud-followers`
  const audMutualsId = `${uid}-aud-mutuals`

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

  // 既存フラグ ↔ 単一選択の相互変換
  const audienceFromFlags = (d: PrivacySetting): Audience =>
    d.follow_back_only ? 'mutuals' : d.followers_only ? 'followers' : 'public'

  const flagsFromAudience = (a: Audience) =>
    a === 'mutuals'
      ? { followers_only: true, follow_back_only: true }
      : a === 'followers'
      ? { followers_only: true, follow_back_only: false }
      : { followers_only: false, follow_back_only: false }

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
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">公開範囲</div>
          <RadioGroup
            value={audienceFromFlags(draft)}
            onValueChange={(v) => {
              const nextFlags = flagsFromAudience(v as Audience)
              commit({ ...draft, ...nextFlags })
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {/* 全体 */}
            <label htmlFor={audPublicId} className="cursor-pointer">
              <RadioGroupItem id={audPublicId} value="public" className="sr-only peer" />
              <div
                className="
                  flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-primary/5
                  peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30
                "
              >
                <Globe className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <div className="font-medium">全体</div>
                  <div className="text-xs text-muted-foreground">誰でも閲覧可</div>
                </div>
              </div>
            </label>

            {/* フォロワー */}
            <label htmlFor={audFollowersId} className="cursor-pointer">
              <RadioGroupItem id={audFollowersId} value="followers" className="sr-only peer" />
              <div
                className="
                  flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-primary/5
                  peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30
                "
              >
                <Users className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <div className="font-medium">フォロワーのみ</div>
                  <div className="text-xs text-muted-foreground">あなたをフォローしている人だけ</div>
                </div>
              </div>
            </label>

            {/* 相互 */}
            <label htmlFor={audMutualsId} className="cursor-pointer">
              <RadioGroupItem id={audMutualsId} value="mutuals" className="sr-only peer" />
              <div
                className="
                  flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-primary/5
                  peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30
                "
              >
                <UserCheck className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <div className="font-medium">相互フォローのみ</div>
                  <div className="text-xs text-muted-foreground">お互いにフォローしている関係</div>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 許可ユーザー */}
          <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">許可ユーザー</div>
            <UserMultiSelectLite
              options={userOptions}
              value={draft.allow_users ?? []}
              onChange={(ids) => {
                // 排他制御：許可に入れたIDは除外から自動で外す
                const nextDeny = (draft.deny_users ?? []).filter((id) => !ids.includes(id))
                commit({ ...draft, allow_users: ids, deny_users: nextDeny })
              }}
              accent="allow"
              placeholder="ユーザーを検索して追加"
            />
          </div>

          {/* 除外ユーザー */}
          <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">除外ユーザー</div>
            <UserMultiSelectLite
              options={userOptions}
              value={draft.deny_users ?? []}
              onChange={(ids) => {
                // 排他制御：除外に入れたIDは許可から自動で外す
                const nextAllow = (draft.allow_users ?? []).filter((id) => !ids.includes(id))
                commit({ ...draft, deny_users: ids, allow_users: nextAllow })
              }}
              accent="deny"
              placeholder="ユーザーを検索して除外"
            />
          </div>
        </div>
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
        {/* コメントアクティビティ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-1 text-xs text-gray-500">直近日数</div>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={draft.comment_activity_filter?.within_days ?? ''}
              onChange={(e) =>
                commit({
                  ...draft,
                  comment_activity_filter: {
                    within_days: e.target.value === '' ? undefined : Number(e.target.value),
                    min_comments: draft.comment_activity_filter?.min_comments,
                  },
                })
              }
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-500">最小コメント数</div>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={draft.comment_activity_filter?.min_comments ?? ''}
              onChange={(e) =>
                commit({
                  ...draft,
                  comment_activity_filter: {
                    within_days: draft.comment_activity_filter?.within_days,
                    min_comments: e.target.value === '' ? undefined : Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>

        {/* デバイスタイプ */}
        <div>
          <div className="mb-1 text-xs text-gray-500">許可デバイス</div>
          <div className="flex gap-4 text-sm">
            {(['mobile', 'desktop'] as DeviceType[]).map((d) => (
              <label key={d} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.device_types?.includes(d)}
                  onChange={() => onDeviceToggle(d)}
                />
                {d}
              </label>
            ))}
          </div>
        </div>

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
