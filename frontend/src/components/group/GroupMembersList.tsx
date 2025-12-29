'use client';

import UserLine from '@/components/user/UserLine';
import { Button } from '@/components/ui/button';

export type GroupMemberStatus = 'normal' | 'toAdd' | 'toRemove';

export type GroupMemberItem = {
  id: string;
  name: string;
  src?: string | null;
  subtitle?: string; // emailなど
  status?: GroupMemberStatus; // 追加：行の状態
};

export default function GroupMembersList({
  items,
  onRemove,
  onUndo,
}: {
  items: GroupMemberItem[];
  onRemove?: (id: string) => void;
  onUndo?: (id: string) => void;
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
      {items.map((m) => {
        const status = m.status ?? 'normal';

        return (
          <li key={m.id} className="flex items-center justify-between">
            <UserLine
              name={m.name}
              src={m.src ?? undefined}
              subtitle={m.subtitle}
              size="md"
              className="flex-1"
            />

            <div className="ml-2 flex items-center gap-2">
              {/* 行内Undo：状態が変わっている行だけ表示したいなら条件を追加 */}
              {onUndo && status !== 'normal' ? (
                <Button
                  variant="link"
                  size="sm"
                  className="px-0"
                  onClick={() => onUndo(m.id)}
                  aria-label={`${m.name} の変更を取り消し`}
                >
                  取り消し
                </Button>
              ) : null}

              {/* 削除：要件が「非表示」なら onRemove が無い時は描画しない */}
              {onRemove ? (
                <Button
                  variant="link"
                  size="sm"
                  className="text-red-600 px-0"
                  onClick={() => onRemove(m.id)}
                  aria-label={`${m.name} をグループから削除`}
                >
                  削除
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
