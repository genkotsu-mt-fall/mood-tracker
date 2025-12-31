'use client';

import type { KeyedMutator } from 'swr';
import MeProfileBar from '@/components/me/MeProfileBar';
import UserFollowButtonUI from '@/components/user/UserFollowButton.UI';
import { useFollowToggleUx } from '@/components/user/useFollowToggleUx';
import type { UserProfileResponse } from '@/lib/user/useUserProfileOptions';

export default function UserProfileView({
  id,
  data,
  mutate,
}: {
  id: string;
  data: UserProfileResponse;
  mutate: KeyedMutator<UserProfileResponse>;
}) {
  const u = data.profile;
  const hasName = !!u?.name?.trim();
  const name = (hasName ? u?.name : u?.email) ?? '（名前未設定）';
  const subtitle = hasName ? (u?.email ?? undefined) : undefined;

  const ux = useFollowToggleUx({
    followeeId: id,
    data,
    mutate,
  });

  return (
    <MeProfileBar
      name={name}
      subtitle={subtitle}
      followersCount={data.followersCount}
      followingCount={data.followingCount}
      action={
        <UserFollowButtonUI
          isMe={data.isMe}
          isFollowing={data.isFollowing}
          isPending={ux.isPending}
          onToggle={ux.onToggle}
        />
      }
    />
  );
}
