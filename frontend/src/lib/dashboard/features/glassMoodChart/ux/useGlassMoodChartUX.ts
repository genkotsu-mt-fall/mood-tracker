'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import type {
  ComposedChartMouseDown,
  MouseDownState,
} from '@/lib/dashboard/events/recharts/mouseDown.types';
import { extractClientXFromMouseDownEvent } from '@/lib/dashboard/events/pointer/extractClientXFromMouseDownEvent';
import { getChartPointerFromMouseEvent } from '@/lib/dashboard/events/pointer/getChartPointerFromMouseDownEvent';
import { parseActiveIndex } from '@/lib/dashboard/events/recharts/parseActiveIndex';
import { isFiniteNumber } from '@/lib/dashboard/utils/number/guards';
import { isEventFromDot } from '@/lib/dashboard/features/glassMoodChart/hitTest';
import { attachWindowDragListeners } from '@/lib/dashboard/features/glassMoodChart/drag/attachWindowDragListeners';
import type { DragSession } from '@/lib/dashboard/features/glassMoodChart/drag/types/DragSession';
import { createOnWindowMove } from '@/lib/dashboard/features/glassMoodChart/drag/handlers/onWindowMove';
import { createOnWindowUp } from '@/lib/dashboard/features/glassMoodChart/drag/handlers/onWindowUp';
import { createTryInsertByClick } from '@/lib/dashboard/features/glassMoodChart/points/tryInsertByClick';
import type { ClickSeed } from '@/lib/dashboard/features/glassMoodChart/interactions/click/clickSeed';
import { EditPopoverState } from '../popover/useEditPopoverState';
import { ChartPointUI, FilterTag } from '../model';

type EditPopover = { time: string; anchor: { x: number; y: number } } | null;

export type PointClickHandler = (
  p: ChartPointUI,
  anchor: { x: number; y: number },
) => void;

type Args = {
  // from Data
  windowStart: number;
  setWindowStart: React.Dispatch<React.SetStateAction<number>>;
  maxWindowStart: number;

  pointsRef: React.RefObject<ChartPointUI[]>;
  filteredDataRef: React.RefObject<ChartPointUI[]>;
  selectedTagRef: React.RefObject<FilterTag>;
  setPoints: React.Dispatch<React.SetStateAction<ChartPointUI[]>>;

  findPointByTime: (time: string) => ChartPointUI | undefined;

  // shared flag
  panningRef: React.RefObject<boolean>;

  // popover
  editPopover: EditPopover;
  setEditPopover: React.Dispatch<React.SetStateAction<EditPopoverState | null>>;
};

export function useGlassMoodChartUX({
  windowStart,
  setWindowStart,
  maxWindowStart,
  pointsRef,
  filteredDataRef,
  selectedTagRef,
  setPoints,
  findPointByTime,
  panningRef,
  editPopover,
  setEditPopover,
}: Args) {
  /**
   * パン（ドラッグ）セッション
   */
  const dragRef = useRef<DragSession | null>(null);

  /**
   * window の listener を解除するための関数（attach が返す detach）を保持
   */
  const detachDragListenersRef = useRef<null | (() => void)>(null);

  /**
   * 現在 attach 済みなら確実に解除する（同じ参照で remove するため）
   */
  const detachWindowDragListeners = React.useCallback(() => {
    detachDragListenersRef.current?.();
    detachDragListenersRef.current = null;
  }, []);

  /**
   * unmount でも解除（事故防止）
   */
  useEffect(() => {
    return () => {
      detachWindowDragListeners();
    };
  }, [detachWindowDragListeners]);

  /**
   * clickSeed から中間点を作る処理（deps 注入済み）
   */
  const tryInsertByClick = useMemo(() => {
    return createTryInsertByClick({
      pointsRef,
      filteredDataRef,
      selectedTagRef,
      setPoints,
      setEditPopover,
    });
  }, [pointsRef, filteredDataRef, selectedTagRef, setPoints, setEditPopover]);

  /**
   * window move/up（deps 注入済み）
   */
  const onWindowMove = useMemo(() => {
    return createOnWindowMove({
      dragRef,
      panningRef,
      maxWindowStart,
      setEditPopover,
      setWindowStart,
    });
  }, [maxWindowStart, setEditPopover, setWindowStart, panningRef]);

  const onWindowUp = useMemo(() => {
    return createOnWindowUp({
      dragRef,
      panningRef,
      maxWindowStart,
      detachWindowDragListeners,
      setWindowStart,
      tryInsertByClick,
    });
  }, [
    maxWindowStart,
    detachWindowDragListeners,
    setWindowStart,
    tryInsertByClick,
    panningRef,
  ]);

  const handlePointClick: PointClickHandler = (p, anchor) => {
    if (p.isPad) return;
    setEditPopover({ time: p.time, anchor });
  };

  const handleChartMouseDown: ComposedChartMouseDown = (s, e) => {
    const clientX = extractClientXFromMouseDownEvent(e);
    if (!isFiniteNumber(clientX)) return;

    // ドット上なら “中間点作成の種” を作らない
    const fromDot = isEventFromDot(e);

    const ptr = getChartPointerFromMouseEvent(e);
    const pointerX = ptr?.x;

    const activeIdx = parseActiveIndex(
      (s as MouseDownState).activeTooltipIndex,
    );
    const activeX = (s as MouseDownState).activeCoordinate?.x;
    const activeY = (s as MouseDownState).activeCoordinate?.y;

    let clickSeed: ClickSeed | undefined = undefined;

    if (
      !fromDot &&
      isFiniteNumber(pointerX) &&
      activeIdx != null &&
      isFiniteNumber(activeX)
    ) {
      const anchorY = isFiniteNumber(activeY) ? activeY : (ptr?.y ?? NaN);
      if (isFiniteNumber(anchorY)) {
        clickSeed = { pointerX, activeIdx, activeX, anchorY };
      }
    }

    dragRef.current = {
      startClientX: clientX,
      startWindowStart: windowStart,
      isDragging: false,
      clickSeed,
    };

    detachWindowDragListeners();
    detachDragListenersRef.current = attachWindowDragListeners({
      onWindowMove,
      onWindowUp,
    });
  };

  const editPoint = editPopover ? findPointByTime(editPopover.time) : undefined;
  const isEditingDraft = !!editPoint?.isDraft;

  function closeEditor() {
    setEditPopover(null);
  }

  function cancelEditor() {
    if (isEditingDraft) {
      setPoints((prev) => prev.filter((p) => p.time !== editPopover?.time));
    }
    closeEditor();
  }

  function saveEditor() {
    if (!editPopover) return;
    const t = editPopover.time;

    setPoints((prev) =>
      prev.map((p) => {
        if (p.isPad) return p;
        if (p.time !== t) return p;
        if (!p.isDraft) return p;
        return { ...p, isDraft: false };
      }),
    );

    closeEditor();
  }

  return {
    handleChartMouseDown,
    handlePointClick,

    editPoint,
    isEditingDraft,
    cancelEditor,
    saveEditor,
  };
}
