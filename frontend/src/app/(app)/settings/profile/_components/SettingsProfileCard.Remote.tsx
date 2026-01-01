'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyProfileOptions } from '@/lib/me/useMeProfileOptions';
import SettingsProfileCardView from './SettingsProfileCard.View';

export default function SettingsProfileCardRemote() {
  const { data, error, isLoading, mutate } = useMyProfileOptions();

  // ローディング中に unknown error を作らない
  const effectiveError =
    error ?? (!isLoading && !data ? new Error('unknown error') : undefined);

  // data が来たタイミングで remount して初期値を確実に反映
  const viewKey = data?.profile?.id ?? 'loading';

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={effectiveError}
      className="mb-4"
      loading={<>プロフィールを読み込み中…</>}
      errorView={(e) => <>プロフィールの取得に失敗しました：{e.message}</>}
    >
      <SettingsProfileCardView key={viewKey} data={data} mutate={mutate} />
    </RemoteBoundary>
  );
}
