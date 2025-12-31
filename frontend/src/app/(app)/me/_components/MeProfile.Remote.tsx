'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useMyProfileOptions } from '@/lib/me/useMeProfileOptions';
import MeProfileView from './MeProfile.View';
import MeProfileBar from '@/components/me/MeProfileBar';

export default function MeProfileRemote() {
  const { data, isLoading, error } = useMyProfileOptions();

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      // 省スペース固定バー（高さを取らない）
      className="shrink-0 h-12 rounded-xl border bg-white px-3 flex items-center"
      loading={<MeProfileBar loading />}
      errorView={(e) => <MeProfileBar error={e.message} />}
    >
      <MeProfileView base={data}>
        {(api) => <MeProfileBar {...api.barProps} />}
      </MeProfileView>
    </RemoteBoundary>
  );
}
