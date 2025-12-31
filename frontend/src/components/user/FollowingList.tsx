'use client';

import UserLine from '@/components/user/UserLine';
import UserFollowButtonUI from '@/components/user/UserFollowButton.UI';

export type FollowingListItem = {
  id: string;
  name: string;
  src?: string | null;
  subtitle?: string;
};

export default function FollowingListUI({
  items,
  pendingId,
  onUnfollow,
}: {
  items: FollowingListItem[];
  pendingId?: string | null;
  onUnfollow?: (followeeId: string) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        フォロー中のユーザーがいません
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((u) => {
        const isPending = pendingId === u.id;

        return (
          <li key={u.id} className="rounded-xl border bg-white p-3">
            <UserLine
              name={u.name}
              src={u.src ?? undefined}
              subtitle={u.subtitle}
              size="md"
              className="w-full"
            >
              <UserFollowButtonUI
                isMe={false}
                isFollowing={true}
                isPending={isPending}
                onToggle={() => onUnfollow?.(u.id)}
                className="h-8"
              />
            </UserLine>
          </li>
        );
      })}
    </ul>
  );
}
