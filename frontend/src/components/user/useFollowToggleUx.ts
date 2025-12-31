'use client';

import { useTransition } from 'react';
import type { KeyedMutator } from 'swr';
import type { UserProfileResponse } from '@/lib/user/useUserProfileOptions';
import { toggleFollowAction } from '@/components/user/toggleFollow.action';

export function useFollowToggleUx({
  followeeId,
  data,
  mutate,
}: {
  followeeId: string;
  data: UserProfileResponse;
  mutate: KeyedMutator<UserProfileResponse>;
}) {
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    if (isPending) return;
    if (data.isMe) return;

    const prev = data;
    const intent: 'follow' | 'unfollow' = data.isFollowing
      ? 'unfollow'
      : 'follow';

    // optimistic: isFollowing だけ切り替える（数値は触らない）
    const optimistic: UserProfileResponse = {
      ...data,
      isFollowing: !data.isFollowing,
    };

    startTransition(() => {
      void (async () => {
        // 1) optimistic（revalidate しない）
        await mutate(optimistic, false);

        // 2) server action
        const res = await toggleFollowAction(followeeId, intent);

        if (!res.ok) {
          // 3) rollback（revalidate しない）
          await mutate(prev, false);
          return;
        }

        // 4) 成功 → 再検証（真値へ）
        await mutate();
      })();
    });
  };

  return { isPending, onToggle };
}
