import UserMultiSelectLite from './UserMultiSelectLite';
import type { PrivacySetting } from '@/lib/privacy/types';
import type { Option } from '@/lib/common/types';
import AudienceScopeSelector from './AudienceScopeSelector';
import { audienceFromFlags, flagsFromAudience } from '@/lib/privacy/audience';
import UserMultiSelectLiteRemote from './UserMultiSelectLite.Remote';

export type AudienceSectionProps = {
  draft: PrivacySetting;
  userOptions: Option[];
  onChange: (next: PrivacySetting) => void;
};

export default function AudienceSection({
  draft,
  userOptions,
  onChange,
}: AudienceSectionProps) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        公開範囲
      </div>

      {/* 分割したセレクタを使用 */}
      <AudienceScopeSelector
        value={audienceFromFlags(draft)}
        onChange={(aud) => onChange({ ...draft, ...flagsFromAudience(aud) })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* 許可ユーザー */}
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            許可ユーザー
          </div>
          <UserMultiSelectLiteRemote
            value={draft.allow_users ?? []}
            onChange={(ids) => {
              // 排他制御：許可に入れたIDは除外から自動で外す
              const nextDeny = (draft.deny_users ?? []).filter(
                (id) => !ids.includes(id),
              );
              onChange({ ...draft, allow_users: ids, deny_users: nextDeny });
            }}
            accent="allow"
            placeholder="ユーザーを検索して追加"
          />
        </div>
        {/* 除外ユーザー */}
        <div className="rounded-lg border bg-card p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            除外ユーザー
          </div>
          <UserMultiSelectLiteRemote
            value={draft.deny_users ?? []}
            onChange={(ids) => {
              // 排他制御：除外に入れたIDは許可から自動で外す
              const nextAllow = (draft.allow_users ?? []).filter(
                (id) => !ids.includes(id),
              );
              onChange({ ...draft, deny_users: ids, allow_users: nextAllow });
            }}
            accent="deny"
            placeholder="ユーザーを検索して除外"
          />
        </div>
      </div>
    </div>
  );
}
