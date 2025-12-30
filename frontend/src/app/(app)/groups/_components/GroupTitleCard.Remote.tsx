'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useGroupOptions } from '@/lib/group/useGroup';
import GroupTitleCardView from './GroupTitleCard.View';

export default function GroupTitleCardRemote({ id }: { id: string }) {
  const { data, error, isLoading } = useGroupOptions(id);

  // 既存ロジック（error || !data）を RemoteBoundary に寄せる
  const effectiveError =
    error ?? (!data ? new Error('unknown error') : undefined);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={effectiveError}
      className="mb-4"
      loading={<>グループを読み込み中…</>}
      errorView={(e) => <>グループ情報の取得に失敗しました：{e.message}</>}
    >
      {/* effectiveError が無ければ data は存在する前提 */}
      <GroupTitleCardView baseName={data!.name} />
    </RemoteBoundary>
  );
}
