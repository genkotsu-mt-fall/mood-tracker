'use client';

import React from 'react';
import { UserMiniCard } from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCard';

type Item = React.ComponentProps<typeof UserMiniCard>['p'];

type Props = {
  items: readonly Item[];
  /** React key 用（例: keySpec.getKey(p) を渡す） */
  getKey: (p: Item) => string;
  /** 表示用（例: p.time.slice(11) などを渡す） */
  getSubtitle: (p: Item) => string;
};

export default function UserMiniCardSlider({
  items,
  getKey,
  getSubtitle,
}: Props) {
  return (
    <div className="shrink-0">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="text-xs font-semibold text-white/80">Recent posts</div>
        <div className="text-xs text-white/50">{items.length} items</div>
      </div>

      <div
        className="
          mt-2
          flex gap-2
          overflow-x-auto no-scrollbar
          pb-2
          snap-x snap-mandatory
          [-webkit-overflow-scrolling:touch]
        "
      >
        {items.length === 0 ? (
          <div
            className="
              w-full rounded-2xl
              border border-white/10 bg-white/8
              px-3 py-3 text-sm text-white/70
            "
          >
            No items for this filter.
          </div>
        ) : (
          items.map((p) => (
            <UserMiniCard key={getKey(p)} p={p} subtitle={getSubtitle(p)} />
          ))
        )}
      </div>
    </div>
  );
}
