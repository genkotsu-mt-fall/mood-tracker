'use client';

import UserLine from '@/components/user/UserLine';
import { Button } from '@/components/ui/button';

export type FollowersListItem = {
  id: string;
  name: string;
  src?: string | null;
  subtitle?: string;
};

export default function FollowersList({
  items,
}: {
  items: FollowersListItem[];
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        フォロワーがいません
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
            <Button variant="link" size="sm" disabled>
              フォローする
            </Button>
          </UserLine>
        </li>
      ))}
    </ul>
  );
}
