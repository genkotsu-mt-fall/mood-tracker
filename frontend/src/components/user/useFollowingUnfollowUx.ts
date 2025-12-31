'use client';

import { useState, useTransition } from 'react';
import type { KeyedMutator } from 'swr';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { toggleFollowAction } from '@/components/user/toggleFollow.action';

export function useFollowingUnfollowUx({
  mutate,
}: {
  mutate: KeyedMutator<UserResource[]>;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onUnfollow = (followeeId: string) => {
    if (isPending) return;

    setError(null);
    setPendingId(followeeId);

    startTransition(() => {
      void (async () => {
        try {
          const res = await toggleFollowAction(followeeId, 'unfollow');
          if (!res.ok) {
            setError(res.message);
            return;
          }

          await mutate();
        } finally {
          setPendingId(null);
        }
      })();
    });
  };

  return { isPending, pendingId, error, onUnfollow };
}
