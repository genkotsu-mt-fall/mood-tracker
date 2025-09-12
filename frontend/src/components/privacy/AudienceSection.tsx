import UserMultiSelectLite from './UserMultiSelectLite'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Globe, Users, UserCheck } from 'lucide-react'
import type { PrivacySetting } from '@/lib/privacy/types'
import type { Option } from '@/lib/common/types'
import { useId } from 'react'

export type Audience = 'public' | 'followers' | 'mutuals'

export type AudienceSectionProps = {
  draft: PrivacySetting
  userOptions: Option[]
  onChange: (next: PrivacySetting) => void
}

function audienceFromFlags(d: PrivacySetting): Audience {
  return d.follow_back_only ? 'mutuals' : d.followers_only ? 'followers' : 'public'
}

function flagsFromAudience(a: Audience) {
  return a === 'mutuals'
    ? { followers_only: true, follow_back_only: true }
    : a === 'followers'
    ? { followers_only: true, follow_back_only: false }
    : { followers_only: false, follow_back_only: false }
}

export default function AudienceSection({ draft, userOptions, onChange }: AudienceSectionProps) {
  const uid = useId()
  const audPublicId = `${uid}-aud-public`
  const audFollowersId = `${uid}-aud-followers`
  const audMutualsId = `${uid}-aud-mutuals`

  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted-foreground">公開範囲</div>
      <RadioGroup
        value={audienceFromFlags(draft)}
        onValueChange={(v) => {
          const nextFlags = flagsFromAudience(v as Audience)
          onChange({ ...draft, ...nextFlags })
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {/* 全体 */}
        <label htmlFor={audPublicId} className="cursor-pointer">
          <RadioGroupItem id={audPublicId} value="public" className="sr-only peer" />
          <div
            className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30"
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
            className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30"
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
            className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30"
          >
            <UserCheck className="h-4 w-4 mt-0.5 opacity-80" />
            <div>
              <div className="font-medium">相互フォローのみ</div>
              <div className="text-xs text-muted-foreground">お互いにフォローしている関係</div>
            </div>
          </div>
        </label>
      </RadioGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* 許可ユーザー */}
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">許可ユーザー</div>
          <UserMultiSelectLite
            options={userOptions}
            value={draft.allow_users ?? []}
            onChange={(ids) => {
              // 排他制御：許可に入れたIDは除外から自動で外す
              const nextDeny = (draft.deny_users ?? []).filter((id) => !ids.includes(id))
              onChange({ ...draft, allow_users: ids, deny_users: nextDeny })
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
              onChange({ ...draft, deny_users: ids, allow_users: nextAllow })
            }}
            accent="deny"
            placeholder="ユーザーを検索して除外"
          />
        </div>
      </div>
    </div>
  )
}
