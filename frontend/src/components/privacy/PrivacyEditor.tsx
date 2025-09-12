'use client'

import { useMemo, useState } from 'react'
import type { PrivacySetting, DeviceType } from '@/lib/privacy/types'
import { normalizePrivacySetting, localDateTimeToISO } from '@/lib/privacy/utils'
import type { Option } from '@/lib/common/types'
import { Plus } from 'lucide-react'

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

  // 配列トグル（TSX で安全な関数宣言）
  function toggleInArray<T>(arr: T[] | undefined, v: T): T[] {
    const a = arr ?? []
    return a.includes(v) ? a.filter((x) => x !== v) : [...a, v]
  }

  const onDeviceToggle = (device: DeviceType) =>
    commit({ ...draft, device_types: toggleInArray(draft.device_types, device) })

  // UI
  return (
    <div className="space-y-4">
      {/* フラグ類 */}
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!draft.followers_only}
            onChange={(e) => commit({ ...draft, followers_only: e.target.checked })}
          />
          フォロワーのみ
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!draft.follow_back_only}
            onChange={(e) => commit({ ...draft, follow_back_only: e.target.checked })}
          />
          相互フォローのみ
        </label>
      </div>

      {/* 許可/除外ユーザー */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-gray-500">許可ユーザー</div>
          <select
            multiple
            className="w-full rounded-md border p-2 text-sm min-h-[6rem]"
            value={draft.allow_users ?? []}
            onChange={(e) =>
              commit({
                ...draft,
                allow_users: Array.from(e.target.selectedOptions).map((o) => o.value),
              })
            }
          >
            {userOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1 text-xs text-gray-500">除外ユーザー</div>
          <select
            multiple
            className="w-full rounded-md border p-2 text-sm min-h-[6rem]"
            value={draft.deny_users ?? []}
            onChange={(e) =>
              commit({
                ...draft,
                deny_users: Array.from(e.target.selectedOptions).map((o) => o.value),
              })
            }
          >
            {userOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* グループ＆条件 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-gray-500">許可グループ</div>
          <ul className="w-full rounded-md border text-sm max-h-28 overflow-auto divide-y">
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

        <div>
          <div className="mb-1 text-xs text-gray-500">グループ判定</div>
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="group_mode"
                checked={draft.group_visibility_mode === 'any'}
                onChange={() => commit({ ...draft, group_visibility_mode: 'any' })}
              />
              any（どれか1つ所属）
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="group_mode"
                checked={draft.group_visibility_mode === 'all'}
                onChange={() => commit({ ...draft, group_visibility_mode: 'all' })}
              />
              all（全て所属）
            </label>
          </div>
        </div>
      </div>

      {/* フォロー日数 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-gray-500">最小フォロー日数</div>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={draft.min_follow_days ?? ''}
            onChange={(e) =>
              commit({
                ...draft,
                min_follow_days: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-500">最大フォロー日数</div>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={draft.max_follow_days ?? ''}
            onChange={(e) =>
              commit({
                ...draft,
                max_follow_days: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      {followDaysError && <p className="text-xs text-red-600">{followDaysError}</p>}

      {/* 閲覧可能時間帯 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-gray-500">閲覧可（開始 HH:mm）</div>
          <input
            type="time"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={draft.viewable_time_range?.start ?? ''}
            onChange={(e) =>
              commit({
                ...draft,
                viewable_time_range: {
                  start: e.target.value,
                  end: draft.viewable_time_range?.end ?? '',
                },
              })
            }
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-500">閲覧可（終了 HH:mm）</div>
          <input
            type="time"
            className="w-full rounded-md border px-2 py-1 text-sm"
            value={draft.viewable_time_range?.end ?? ''}
            onChange={(e) =>
              commit({
                ...draft,
                viewable_time_range: {
                  start: draft.viewable_time_range?.start ?? '',
                  end: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* 公開期間 */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* コメントアクティビティ */}
      <div className="grid grid-cols-2 gap-3">
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
    </div>
  )
}
