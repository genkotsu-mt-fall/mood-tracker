'use client';

import UserLine from '@/components/user/UserLine';
import { Button } from '@/components/ui/button';

export type GroupMemberItem = {
  id: string;
  name: string;
  src?: string | null;
  subtitle?: string; // emailなど
};

export default function GroupMembersList({
  items,
  onRemove, // 未来の削除API実装用（任意）
}: {
  items: GroupMemberItem[];
  onRemove?: (id: string) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        メンバーがいません
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li key={m.id} className="flex items-center justify-between">
          <UserLine
            name={m.name}
            src={m.src ?? undefined}
            subtitle={m.subtitle}
            size="md"
            className="flex-1"
          />
          <Button
            variant="link"
            size="sm"
            className="text-red-600"
            disabled={!onRemove}
            onClick={() => onRemove?.(m.id)}
            aria-label={`${m.name} をグループから削除`}
          >
            削除
          </Button>
        </li>
      ))}
    </ul>
  );
}
