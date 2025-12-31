'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useUserProfileOptions } from '@/lib/user/useUserProfileOptions';
import MeProfileBar from '@/components/me/MeProfileBar';
import UserProfileView from './UserProfile.View';

export default function UserProfileRemote({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useUserProfileOptions(id);

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="shrink-0 h-12 rounded-xl border bg-white px-3 flex items-center"
      loading={<MeProfileBar loading />}
      errorView={(e) => <MeProfileBar error={e.message} />}
    >
      {data ? <UserProfileView id={id} data={data} mutate={mutate} /> : null}
    </RemoteBoundary>
  );
}
