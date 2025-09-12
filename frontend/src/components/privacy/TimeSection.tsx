import FollowDaysFieldset from './FollowDaysFieldset'
import ViewableTimeRangeField from './ViewableTimeRangeField'
import { localDateTimeToISO } from '@/lib/privacy/utils'
import type { PrivacySetting } from '@/lib/privacy/types'

type Props = {
  draft: PrivacySetting
  commit: (next: PrivacySetting) => void
  followDaysError: string | null
}

export default function TimeSection({ draft, commit, followDaysError }: Props) {
  return (
    <>
      {/* フォロー日数（リッチ版） */}
      <FollowDaysFieldset
        draft={draft}
        commit={commit}
        followDaysError={followDaysError}
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
    </>
  )
}
