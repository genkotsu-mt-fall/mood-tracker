'use client';

import type { KeyedMutator } from 'swr';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import FollowingListUI, {
  type FollowingListItem,
} from '@/components/user/FollowingList';
import { useFollowingUnfollowUx } from '@/components/user/useFollowingUnfollowUx';

function toLabel(u: UserResource): string {
  return u.name ?? u.email;
}

function toSubtitle(u: UserResource): string | undefined {
  return u.email;
}

export default function FollowingListView({
  users,
  mutate,
}: {
  users: UserResource[];
  mutate: KeyedMutator<UserResource[]>;
}) {
  const ux = useFollowingUnfollowUx({ mutate });

  const items: FollowingListItem[] = users.map((u) => ({
    id: u.id,
    name: toLabel(u),
    src: undefined,
    subtitle: toSubtitle(u),
  }));

  return (
    <>
      {ux.error ? (
        <div className="mb-2 rounded-lg border bg-white p-2 text-sm text-rose-700">
          {ux.error}
        </div>
      ) : null}

      <FollowingListUI
        items={items}
        pendingId={ux.pendingId}
        onUnfollow={ux.onUnfollow}
      />
    </>
  );
}
