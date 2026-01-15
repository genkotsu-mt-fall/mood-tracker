'use client';

import { useState } from 'react';

export type EditPopoverState = {
  key: string; // 対象ポイントの key（draft でも既存でも）
  anchor: { x: number; y: number }; // 表示座標（チャート内）
};

export function useEditPopoverState() {
  const [editPopover, setEditPopover] = useState<EditPopoverState | null>(null);

  return { editPopover, setEditPopover };
}
