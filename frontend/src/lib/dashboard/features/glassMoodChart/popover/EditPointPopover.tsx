'use client';

import React, { useMemo } from 'react';
import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { EditPopoverState } from './useEditPopoverState';

export type EditPointLike = {
  /** 表示用（例: "2026/01/02 09:00" や "09:00" など） */
  subtitle: string;

  value: number | null;
  emoji?: string | null;
  tags?: string[] | null;
  isDraft?: boolean;
  isPad?: boolean;
};

export type EditPointPatch = {
  emoji?: string;
  value?: number;
};

type Props = {
  editPopover: EditPopoverState | null;
  editPoint: EditPointLike | undefined;
  isEditingDraft: boolean;
  onCancel: () => void;
  onSave: () => void;
  // ✅ time ではなく key
  onUpdate: (key: string, patch: EditPointPatch) => void;
};

export default function EditPointPopover({
  editPopover,
  editPoint,
  isEditingDraft,
  onCancel,
  onSave,
  onUpdate,
}: Props) {
  const popoverStyle = useMemo((): React.CSSProperties | undefined => {
    if (!editPopover) return undefined;
    const x = editPopover.anchor.x;
    const y = editPopover.anchor.y;
    return {
      left: x + 14,
      top: Math.max(8, y - 110),
    };
  }, [editPopover]);

  if (!editPopover || !editPoint) return null;

  const key = editPopover.key;

  return (
    <div
      className="
        absolute z-20
        w-[260px]
        rounded-2xl
        border border-white/18
        bg-white/12
        backdrop-blur-lg
        shadow-[0_18px_50px_rgba(0,0,0,0.40)]
        p-3
      "
      style={popoverStyle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/85">
            {isEditingDraft ? 'New point' : 'Edit point'}
          </div>
          <div className="mt-0.5 text-xs text-white/60">
            {editPoint.subtitle}
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="
            shrink-0
            rounded-full
            border border-white/15 bg-white/10
            px-2 py-1 text-xs font-semibold text-white/80
            hover:bg-white/14
            focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
          "
        >
          Close
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <label className="grid gap-1">
          <span className="text-[11px] font-semibold text-white/70">Emoji</span>
          <input
            value={editPoint.emoji ?? ''}
            onChange={(e) => onUpdate(key, { emoji: e.target.value })}
            className="
              h-9 w-full rounded-xl
              border border-white/15 bg-white/10
              px-3 text-sm text-white/90
              outline-none
              focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/20
            "
            inputMode="text"
            placeholder="🙂"
          />
        </label>

        <label className="grid gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white/70">
              Value
            </span>
            <span className="text-[11px] font-extrabold text-white/90">
              {typeof editPoint.value === 'number'
                ? Math.round(editPoint.value)
                : '--'}
              %
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={
              typeof editPoint.value === 'number'
                ? Math.round(editPoint.value)
                : 50
            }
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              onUpdate(key, { value: clamp(n, 0, 100) });
            }}
            className="w-full"
          />
        </label>

        {Array.isArray(editPoint.tags) && editPoint.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {editPoint.tags.slice(0, 3).map((tg) => (
              <span
                key={tg}
                className="rounded-full border border-white/12 bg-white/8 px-2 py-0.5 text-[11px] text-white/70"
              >
                {tg}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="
              flex-1 rounded-xl
              border border-white/15 bg-white/10
              px-3 py-2 text-xs font-semibold text-white/80
              hover:bg-white/14
              focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="
              flex-1 rounded-xl
              border border-sky-300/25 bg-sky-300/15
              px-3 py-2 text-xs font-extrabold text-white
              hover:bg-sky-300/18
              focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
