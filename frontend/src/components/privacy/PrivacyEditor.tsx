'use client';

import AudienceSection from './AudienceSection';
import { useMemo, useState } from 'react';
import type { PrivacySetting } from '@/lib/privacy/types';
import { normalizePrivacySetting } from '@/lib/privacy/utils';
import type { Option } from '@/lib/common/types';
import { Globe, Users, Clock, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import GroupSection from './GroupSection';
import TimeSection from './TimeSection';
import AdvancedSection from './AdvancedSection';
import GroupSectionRemote from './GroupSection.Remote';

type Props = {
  value?: PrivacySetting;
  onChange: (next: PrivacySetting | undefined) => void;
  userOptions?: Option[];
  onHoverGroupChange?: (groupId: string | null) => void;
  /** クリックで親にダイアログ表示を依頼し、作成されたグループを返す */
  onRequestCreateGroup?: () => Promise<Option | void>;
};

export default function PrivacyEditor({
  value,
  onChange,
  userOptions = [],
  onHoverGroupChange,
  onRequestCreateGroup,
}: Props) {
  // 内部編集用のドラフト
  const [draft, setDraft] = useState<PrivacySetting>(value ?? {});
  // const uid = useId() // 未使用のため削除

  // min/max の相関チェック
  const followDaysError = useMemo(() => {
    if (
      draft.min_follow_days === undefined ||
      draft.max_follow_days === undefined
    )
      return '';
    return draft.min_follow_days > draft.max_follow_days
      ? 'min_follow_days は max_follow_days 以下にしてください'
      : '';
  }, [draft.min_follow_days, draft.max_follow_days]);

  // 変更時に normalize して親に返す
  const commit = (next: PrivacySetting) => {
    setDraft(next);
    onChange(normalizePrivacySetting(next));
  };

  // 配列トグル
  // toggleInArray は GroupSection.tsx へ分離済み

  // const onDeviceToggle = (device: DeviceType) =>
  //   commit({ ...draft, device_types: toggleInArray(draft.device_types, device) })

  // === コメントアクティビティ（リッチ版）用ヘルパ ===
  // コメントアクティビティ関連のヘルパは AdvancedSection.tsx へ分離済み

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
        <AudienceSection
          draft={draft}
          userOptions={userOptions}
          onChange={commit}
        />
      </TabsContent>

      {/* --- グループ --- */}
      <TabsContent value="groups" className="mt-4 space-y-4">
        {/* <GroupSection
          draft={draft}
          groupOptions={groupOptions}
          onHoverGroupChange={onHoverGroupChange}
          onRequestCreateGroup={onRequestCreateGroup}
          commit={commit}
        /> */}
        <GroupSectionRemote
          draft={draft}
          onHoverGroupChange={onHoverGroupChange}
          onRequestCreateGroup={onRequestCreateGroup}
          commit={commit}
        />
      </TabsContent>

      {/* --- 時刻・期間 --- */}
      <TabsContent value="time" className="mt-4 space-y-6">
        <TimeSection
          draft={draft}
          commit={commit}
          followDaysError={followDaysError || null}
        />
      </TabsContent>

      {/* --- 詳細 --- */}
      <TabsContent value="advanced" className="mt-4 space-y-6">
        <AdvancedSection
          draft={draft}
          commit={commit}
          setDraft={setDraft}
          onChange={onChange}
        />
      </TabsContent>
    </Tabs>
  );
}
