'use client';

import UserLine from '@/components/user/UserLine';
import { Button } from '@/components/ui/button';

export type FollowingListItem = {
  id: string;
  name: string;
  src?: string | null;
  subtitle?: string;
};

export default function FollowingList({
  items,
}: {
  items: FollowingListItem[];
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
      {items.map((u) => (
        <li key={u.id} className="rounded-xl border bg-white p-3">
          <UserLine
            name={u.name}
            src={u.src ?? undefined}
            subtitle={u.subtitle}
            size="md"
            className="w-full"
          >
            <Button
              variant="link"
              size="sm"
              className="text-red-600"
              disabled
              aria-label={`${u.name} のフォローを解除`}
            >
              フォロー解除
            </Button>
          </UserLine>
        </li>
      ))}
    </ul>
  );
}
