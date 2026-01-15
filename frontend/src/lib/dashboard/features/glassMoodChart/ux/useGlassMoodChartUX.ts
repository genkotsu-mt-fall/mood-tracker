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
import type { EditPopoverState } from '../popover/useEditPopoverState';
import { ChartPointUI, FilterTag } from '../model';
import { PointKeySpec } from '../spec/pointKeySpec';
import type { PointXSpec } from '../spec/pointXSpec';
import type { PointDraftSpec } from '../spec/pointDraftSpec';
import type { PointSpec } from '../spec/pointSpec';

type EditPopover = EditPopoverState | null;

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

  // ✅ STEP-1: keySpec 注入
  keySpec: PointKeySpec<ChartPointUI>;

  xSpec: PointXSpec<ChartPointUI, string>;

  // ✅ STEP-2.5
  draftSpec: PointDraftSpec<ChartPointUI, string>;

  // ✅ STEP-3
  pointSpec: PointSpec<ChartPointUI>;

  findPointByKey: (key: string) => ChartPointUI | undefined;

  panningRef: React.RefObject<boolean>;

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
  keySpec,
  xSpec,
  draftSpec,
  pointSpec,
  findPointByKey,
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
      xSpec,
      keySpec,
      draftSpec,
      pointSpec,
    });
  }, [
    pointsRef,
    filteredDataRef,
    selectedTagRef,
    setPoints,
    setEditPopover,
    xSpec,
    keySpec,
    draftSpec,
    pointSpec,
  ]);

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
    if (pointSpec.isPad(p)) return;
    // ✅ STEP-1: key は keySpec で決める
    const key = keySpec.getKey(p);
    setEditPopover({ key, anchor });
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

  const editPoint = editPopover ? findPointByKey(editPopover.key) : undefined;

  // ✅ STEP-3: isDraft 直参照をやめる
  const isEditingDraft = !!editPoint && pointSpec.isDraft(editPoint);

  function closeEditor() {
    setEditPopover(null);
  }

  function cancelEditor() {
    if (isEditingDraft && editPopover) {
      const key = editPopover.key;

      // ✅ STEP-1: p.time !== key をやめ、getKey(p) !== key にする
      setPoints((prev) =>
        prev.filter((p) =>
          pointSpec.isPad(p) ? true : keySpec.getKey(p) !== key,
        ),
      );
    }
    closeEditor();
  }

  function saveEditor() {
    if (!editPopover) return;
    const key = editPopover.key;

    // ✅ STEP-1: p.time === key をやめ、getKey(p) === key にする
    setPoints((prev) =>
      prev.map((p) => {
        if (pointSpec.isPad(p)) return p;
        if (keySpec.getKey(p) !== key) return p;
        if (!pointSpec.isDraft(p)) return p;

        // ✅ STEP-3: isDraft: false を直書きしない
        return pointSpec.clearDraft(p);
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
