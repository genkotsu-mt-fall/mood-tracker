import type React from 'react';
import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { isFiniteNumber } from '@/lib/dashboard/utils/number/guards';
import { DragSession } from '../types/DragSession';
import { DRAG_THRESHOLD_PX, POINT_PX } from '../../constants';
import { EditPopoverState } from '../../popover/useEditPopoverState';
import { extractClientXFromWindowEvent } from '@/lib/dashboard/events/pointer/extractClientXFromWindowEvent';

export type CreateOnWindowMoveDeps = {
  dragRef: React.RefObject<DragSession | null>;
  panningRef: React.RefObject<boolean>;
  maxWindowStart: number;
  setEditPopover: React.Dispatch<React.SetStateAction<EditPopoverState | null>>;
  setWindowStart: React.Dispatch<React.SetStateAction<number>>;
};

export function createOnWindowMove(deps: CreateOnWindowMoveDeps) {
  return function onWindowMove(ev: MouseEvent | TouchEvent) {
    const session = deps.dragRef.current;
    if (!session) return;

    // touch の場合、スクロール抑止
    if ('touches' in ev) {
      ev.preventDefault();
    }

    const cx = extractClientXFromWindowEvent(ev);
    if (!isFiniteNumber(cx)) return;

    const deltaX = cx - session.startClientX;

    // まだドラッグ確定していないなら、一定以上動いた時点でドラッグ扱いにする
    if (!session.isDragging) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
      session.isDragging = true;
      deps.panningRef.current = true;
      // パン開始したら編集UIは閉じる
      deps.setEditPopover(null);
    }

    // ドラッグ量(px) → index差分
    // 「左へドラッグ（deltaX<0）で windowStart を減らす」＝古い方へ移動
    const deltaIndex = Math.round(deltaX / POINT_PX);

    const next = clamp(
      session.startWindowStart + deltaIndex,
      0,
      deps.maxWindowStart,
    );

    // 無駄な再描画を避ける
    deps.setWindowStart((prev) => (prev === next ? prev : next));
  };
}
