import { useState } from 'react';

export type EditPopoverState = {
  time: string; // 対象ポイントの time（draft でも既存でも）
  anchor: { x: number; y: number }; // 表示座標（チャート内）
};

export function useEditPopoverState() {
  // 編集ポップオーバー（draft/既存共通）
  const [editPopover, setEditPopover] = useState<EditPopoverState | null>(null);

  return { editPopover, setEditPopover };
}
