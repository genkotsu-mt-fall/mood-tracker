'use client';

import Link from 'next/link';

export type GroupListItem = {
  id: string;
  name: string;
  /** メンバー数が取れる場合のみ表示（任意） */
  count?: number;
};

export default function GroupList({ items }: { items: GroupListItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        グループがありません
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((g) => (
        <li
          key={g.id}
          className="rounded-xl border border-gray-200 bg-white p-3"
        >
          <Link
            href={`/groups/${g.id}`}
            className="flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-semibold">{g.name}</div>
              {typeof g.count === 'number' ? (
                <div className="text-xs text-gray-500">メンバー {g.count}</div>
              ) : null}
            </div>
            <span className="text-sm text-blue-600">詳細 →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
