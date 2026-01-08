'use client';

import React from 'react';

export type FilterTagChipsProps<TTag extends string = string> = {
  tags: readonly TTag[];
  selected: TTag;
  onSelect: (tag: TTag) => void;
};

export default function FilterTagChips<TTag extends string>({
  tags,
  selected,
  onSelect,
}: FilterTagChipsProps<TTag>) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
      {tags.map((t) => {
        const active = selected === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onSelect(t)}
            className={[
              'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
              'border backdrop-blur-md',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40',
              active
                ? 'bg-white/20 border-white/25 text-white'
                : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/14',
            ].join(' ')}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
