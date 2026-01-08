'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { fetchDummyLatest, fetchDummyOlder } from './GlassMoodChart.dummy';
import {
  PAD_START,
  PAD_END,
  ChartPoint,
  FilterTag,
  FILTER_TAGS,
} from './GlassMoodChart.model';
import {
  ComposedChartMouseDown,
  MouseDownState,
} from '@/lib/dashboard/events/recharts/mouseDown.types';
import { extractClientXFromMouseDownEvent } from '@/lib/dashboard/events/pointer/extractClientXFromMouseDownEvent';
import { isFiniteNumber } from '@/lib/dashboard/utils/number/guards';
import { isEventFromDot } from '@/lib/dashboard/features/glassMoodChart/hitTest';
import { getChartPointerFromMouseEvent } from '@/lib/dashboard/events/pointer/getChartPointerFromMouseDownEvent';
import { parseActiveIndex } from '@/lib/dashboard/events/recharts/parseActiveIndex';
import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { useEditPopoverState } from '@/lib/dashboard/features/glassMoodChart/popover/useEditPopoverState';
import { attachWindowDragListeners } from '@/lib/dashboard/features/glassMoodChart/drag/attachWindowDragListeners';
import { DragSession } from '@/lib/dashboard/features/glassMoodChart/drag/types/DragSession';
import {
  STOCK_TARGET,
  THRESHOLD,
  VISIBLE,
} from '@/lib/dashboard/features/glassMoodChart/constants';
import { ClickSeed } from '@/lib/dashboard/features/glassMoodChart/interactions/click/clickSeed';
import { useLatestRef } from '@/lib/dashboard/hooks/useLatestRef';
import { createOnWindowMove } from '@/lib/dashboard/features/glassMoodChart/drag/handlers/onWindowMove';
import { createOnWindowUp } from '@/lib/dashboard/features/glassMoodChart/drag/handlers/onWindowUp';
import { useViewRangeStartState } from '@/lib/dashboard/features/glassMoodChart/viewRange/useViewRangeStartState';
import { createTryInsertByClick } from '@/lib/dashboard/features/glassMoodChart/points/tryInsertByClick';
import { UserMiniCard } from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCard';
import {
  GlowActiveDot,
  GlowDot,
} from '@/lib/dashboard/features/glassMoodChart/components/RechartsDots';
import { PillLabel } from '@/lib/dashboard/features/glassMoodChart/components/PillLabel';

export type PointClickHandler = (
  p: ChartPoint,
  anchor: { x: number; y: number },
) => void;

export default function GlassMoodChart() {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `strokeGrad-${uid}`;
  const pillShadowId = `pillShadow-${uid}`;

  const padStartPoint = useMemo<ChartPoint>(
    () => ({ time: PAD_START, value: null, isPad: true }),
    [],
  );
  const padEndPoint = useMemo<ChartPoint>(
    () => ({ time: PAD_END, value: null, isPad: true }),
    [],
  );

  const { editPopover, setEditPopover } = useEditPopoverState();
  const { windowStart, setWindowStart } = useViewRangeStartState();

  const [selectedTag, setSelectedTag] = useState<FilterTag>('All');
  const selectedTagRef = useLatestRef(selectedTag);

  /**
   * points は「ロード済みの全データ（PAD含む）」を保持する
   * - 無限パンのため、ここは増えていく
   * - draft もここに混在する
   */
  const [points, setPoints] = useState<ChartPoint[]>([
    padStartPoint,
    padEndPoint,
  ]);
  const pointsRef = useLatestRef(points);

  // チャート領域（オーバーレイ配置の基準）
  const chartWrapRef = useRef<HTMLDivElement | null>(null);

  /**
   * 無限ロード用の “擬似DBカーソル”
   * - beforeIndex: 「この index より古いものをください」の境界（exclusive）
   */
  const beforeIndexRef = useRef<number | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const fetchingRef = useRef<boolean>(false);

  /**
   * パン（ドラッグ）セッション
   */
  const dragRef = useRef<DragSession | null>(null);
  const panningRef = useRef<boolean>(false);

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
   * コンポーネントが unmount するときも解除（事故防止）
   */
  useEffect(() => {
    return () => {
      detachWindowDragListeners();
    };
  }, [detachWindowDragListeners]);

  /**
   * 1) 初回ロード：最新50件を取得し、そのうち最新10件を表示
   */
  useEffect(() => {
    const page = fetchDummyLatest(STOCK_TARGET);
    // items は「古い→新しい」想定
    const core = page.items;

    beforeIndexRef.current = page.nextBefore;
    hasMoreRef.current = page.hasMore;

    setPoints([padStartPoint, ...core, padEndPoint]);

    // 最新10件 = 末尾10件なので windowStart は (core.length - VISIBLE)
    const start = Math.max(0, core.length - VISIBLE);
    setWindowStart(start);
  }, [padStartPoint, padEndPoint]);

  /**
   * PADを除いたロード済みデータ（draftも含む）
   */
  const corePoints = useMemo(() => points.filter((p) => !p.isPad), [points]);

  /**
   * windowStart の範囲（0..maxStart）を保つための最大値
   */
  const maxWindowStart = useMemo(() => {
    return Math.max(0, corePoints.length - VISIBLE);
  }, [corePoints.length]);

  /**
   * 表示窓（PAD付き）
   * - チャートに渡すデータは「常に10件+PAD」なので描画が軽い
   */
  const windowedPoints = useMemo(() => {
    const safeStart = clamp(windowStart, 0, maxWindowStart);
    const slice = corePoints.slice(safeStart, safeStart + VISIBLE);
    return [padStartPoint, ...slice, padEndPoint];
  }, [corePoints, windowStart, maxWindowStart, padStartPoint, padEndPoint]);

  /**
   * タグフィルタ：選択外は value:null にして点/ラベルを消し、線も切る
   * ※ここは “表示窓” に対して適用する（全件に適用しない）
   */
  const filteredData = useMemo(() => {
    if (selectedTag === 'All') return windowedPoints;

    return windowedPoints.map((p) => {
      if (p.isPad) return p;
      const hit = (p.tags ?? []).includes(selectedTag);
      if (hit) return p;
      return { ...p, value: null };
    });
  }, [windowedPoints, selectedTag]);
  const filteredDataRef = useLatestRef(filteredData);

  /**
   * スライダー用（Pad除外 + valueがあるものだけ / draft は除外）
   * ※ここも “表示窓” に合わせる（チャートと同期）
   */
  const sliderItems = useMemo(() => {
    return filteredData.filter(
      (p) => !p.isPad && !p.isDraft && typeof p.value === 'number' && p.user,
    );
  }, [filteredData]);

  /**
   * 2) 無限ロード：古い側（左側）の残りが THRESHOLD 以下になったら追加取得
   *
   * - leftRemaining = windowStart
   *   （表示窓の左側に “まだ読み込み済みのデータが何件残っているか”）
   *
   * 例）
   *   core=50件, VISIBLE=10
   *   windowStart=40 → 最新10件
   *   windowStart=30 → 10件分古い
   *   windowStart=20 → 左側残り20 → ここで追加取得
   */
  useEffect(() => {
    // ドラッグ中は “表示が落ち着いてから” 取得する（ズレやジャンプを避ける）
    if (panningRef.current) return;

    if (!hasMoreRef.current) return;
    if (fetchingRef.current) return;

    const leftRemaining = windowStart;
    if (leftRemaining > THRESHOLD) return;

    const before = beforeIndexRef.current;
    if (before == null || before <= 0) {
      hasMoreRef.current = false;
      return;
    }

    // 左側残りを STOCK_TARGET に戻すイメージ
    // 例：leftRemaining=20 のとき need=30
    const need = Math.max(0, STOCK_TARGET - leftRemaining);
    if (need === 0) return;

    fetchingRef.current = true;
    try {
      const page = fetchDummyOlder(before, need);

      beforeIndexRef.current = page.nextBefore;
      hasMoreRef.current = page.hasMore;

      const olderItems = page.items; // 古い→新しい
      const addCount = olderItems.length;

      if (addCount > 0) {
        // 既存の core の前に prepend（古いものは左へ増える）
        setPoints((prev) => {
          const prevCore = prev.filter((p) => !p.isPad);
          return [padStartPoint, ...olderItems, ...prevCore, padEndPoint];
        });

        // prepend した分、windowStart を右にずらして “見えていた区間” を維持する
        setWindowStart((s) => s + addCount);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [windowStart, padStartPoint, padEndPoint]);

  function findPointByTime(time: string): ChartPoint | undefined {
    return points.find((p) => !p.isPad && p.time === time);
  }

  function updatePointByTime(time: string, patch: Partial<ChartPoint>) {
    setPoints((prev) =>
      prev.map((p) => {
        if (p.isPad) return p;
        if (p.time !== time) return p;
        return { ...p, ...patch };
      }),
    );
  }

  /**
   * clickSeed から中間点を作る処理（deps 注入済み）
   * 呼び出し側は tryInsertByClick(seed) だけでOK
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
   * window の move/up ハンドラ（deps 注入済み）
   * attachWindowDragListeners に渡すだけで良い形にしておく
   */
  const onWindowMove = useMemo(() => {
    return createOnWindowMove({
      dragRef,
      panningRef,
      maxWindowStart,
      setEditPopover,
      setWindowStart,
    });
  }, [dragRef, panningRef, maxWindowStart, setEditPopover, setWindowStart]);

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
    dragRef,
    panningRef,
    maxWindowStart,
    detachWindowDragListeners,
    setWindowStart,
    tryInsertByClick,
  ]);

  const handlePointClick: PointClickHandler = (p, anchor) => {
    // 念のため（PADは来ない想定）
    if (p.isPad) return;

    // その時刻の点を編集対象にする
    setEditPopover({ time: p.time, anchor });
  };

  const handleChartMouseDown: ComposedChartMouseDown = (s, e) => {
    const clientX = extractClientXFromMouseDownEvent(e);
    if (!isFiniteNumber(clientX)) return;

    // ★追加：ドット上なら “中間点作成の種” を作らない
    const fromDot = isEventFromDot(e);

    const ptr = getChartPointerFromMouseEvent(e);
    const pointerX = ptr?.x;

    const activeIdx = parseActiveIndex(
      (s as MouseDownState).activeTooltipIndex,
    );
    const activeX = (s as MouseDownState).activeCoordinate?.x;
    const activeY = (s as MouseDownState).activeCoordinate?.y;

    let clickSeed: ClickSeed | undefined = undefined;

    // ★変更：ドット上クリックの場合は clickSeed を作らない
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

    detachWindowDragListeners(); // 念のため二重登録防止
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
      // draft はキャンセルで消す
      setPoints((prev) => prev.filter((p) => p.time !== editPopover?.time));
    }
    closeEditor();
  }

  function saveEditor() {
    if (!editPopover) return;
    // draft を確定（isDraftを外す）
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

  // オーバーレイ位置：chartWrapRef を基準に absolute
  const popoverStyle = useMemo((): React.CSSProperties | undefined => {
    if (!editPopover) return undefined;
    const x = editPopover.anchor.x;
    const y = editPopover.anchor.y;
    return {
      left: x + 14,
      top: Math.max(8, y - 110),
    };
  }, [editPopover]);

  return (
    <div className="h-full w-full">
      <div
        className="
          h-full overflow-hidden rounded-3xl
          border border-white/15
          bg-white/10
          backdrop-blur-lg
          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
        "
      >
        <div className="h-full min-h-0 min-w-0 px-3 pb-6 pt-4 flex flex-col gap-3">
          {/* Filter tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {FILTER_TAGS.map((t) => {
              const active = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
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

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <div
              ref={chartWrapRef}
              className="relative h-full cursor-grab active:cursor-grabbing"
            >
              {/* Editor popover */}
              {editPopover && editPoint ? (
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
                        {editPoint.time}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={cancelEditor}
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
                      <span className="text-[11px] font-semibold text-white/70">
                        Emoji
                      </span>
                      <input
                        value={editPoint.emoji ?? ''}
                        onChange={(e) =>
                          updatePointByTime(editPoint.time, {
                            emoji: e.target.value,
                          })
                        }
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
                          updatePointByTime(editPoint.time, {
                            value: clamp(n, 0, 100),
                          });
                        }}
                        className="w-full"
                      />
                    </label>

                    {Array.isArray(editPoint.tags) &&
                    editPoint.tags.length > 0 ? (
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
                        onClick={cancelEditor}
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
                        onClick={saveEditor}
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
              ) : null}

              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 32, right: 18, left: 18, bottom: 8 }}
                  onMouseDown={handleChartMouseDown}
                >
                  <defs>
                    <linearGradient
                      id={strokeGradId}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="rgba(99,102,241,0.95)" />
                      <stop offset="55%" stopColor="rgba(56,189,248,0.95)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0.95)" />
                    </linearGradient>

                    <filter
                      id={pillShadowId}
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="6"
                        stdDeviation="6"
                        floodColor="rgba(0,0,0,0.28)"
                      />
                    </filter>
                  </defs>

                  {/* active* を得るため内部的に置く（非表示） */}
                  <Tooltip
                    cursor={false}
                    wrapperStyle={{ display: 'none' }}
                    content={() => null}
                  />

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tick={{ fill: 'rgba(226,232,240,0.78)', fontSize: 12 }}
                    tickFormatter={(v) => {
                      const s = String(v);
                      if (s === PAD_START || s === PAD_END) return '';
                      return s.length >= 16 ? s.slice(11) : s;
                    }}
                  />

                  <YAxis hide domain={[0, 100]} />

                  <Line
                    connectNulls={selectedTag === 'All'}
                    type="monotone"
                    dataKey="value"
                    stroke={`url(#${strokeGradId})`}
                    strokeWidth={4}
                    dot={<GlowDot onPointClick={handlePointClick} />}
                    activeDot={
                      <GlowActiveDot onPointClick={handlePointClick} />
                    }
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="value"
                      content={<PillLabel filterId={pillShadowId} />}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User cards slider */}
          <div className="shrink-0">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <div className="text-xs font-semibold text-white/80">
                Recent posts
              </div>
              <div className="text-xs text-white/50">
                {sliderItems.length} items
              </div>
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
              {sliderItems.length === 0 ? (
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
                sliderItems.map((p) => (
                  <UserMiniCard key={`${p.time}-${p.user?.id ?? ''}`} p={p} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
