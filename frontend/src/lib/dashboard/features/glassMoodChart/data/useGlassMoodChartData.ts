'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { useLatestRef } from '@/lib/dashboard/hooks/useLatestRef';
import { useViewRangeStartState } from '@/lib/dashboard/features/glassMoodChart/viewRange/useViewRangeStartState';
import {
  STOCK_TARGET,
  THRESHOLD,
  VISIBLE,
} from '@/lib/dashboard/features/glassMoodChart/constants';

// 既存の ChartPoint / FilterTag をそのまま利用（互換性優先）
import type {
  ChartPoint,
  FilterTag,
} from '@/app/dashboard/_components/GlassMoodChart.model';

export type GlassMoodChartPage = {
  items: ChartPoint[]; // 古い→新しい
  nextBefore: number | null;
  hasMore: boolean;
};

export type FetchLatest = (stockTarget: number) => GlassMoodChartPage;
export type FetchOlder = (before: number, need: number) => GlassMoodChartPage;

type Args = {
  padStartTime: string;
  padEndTime: string;
  fetchLatest: FetchLatest;
  fetchOlder: FetchOlder;
  // UX 側と共有（ドラッグ中はデータ取得を抑止）
  panningRef: React.RefObject<boolean>;
};

export function useGlassMoodChartData({
  padStartTime,
  padEndTime,
  fetchLatest,
  fetchOlder,
  panningRef,
}: Args) {
  const padStartPoint = useMemo<ChartPoint>(
    () => ({ time: padStartTime, value: null, isPad: true }),
    [padStartTime],
  );
  const padEndPoint = useMemo<ChartPoint>(
    () => ({ time: padEndTime, value: null, isPad: true }),
    [padEndTime],
  );

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

  /**
   * 無限ロード用の “擬似DBカーソル”
   * - beforeIndex: 「この index より古いものをください」の境界（exclusive）
   */
  const beforeIndexRef = useRef<number | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const fetchingRef = useRef<boolean>(false);

  /**
   * 1) 初回ロード：最新50件を取得し、そのうち最新10件を表示
   */
  useEffect(() => {
    const page = fetchLatest(STOCK_TARGET);
    const core = page.items; // 古い→新しい

    beforeIndexRef.current = page.nextBefore;
    hasMoreRef.current = page.hasMore;

    setPoints([padStartPoint, ...core, padEndPoint]);

    const start = Math.max(0, core.length - VISIBLE);
    setWindowStart(start);
  }, [fetchLatest, padStartPoint, padEndPoint, setWindowStart]);

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
   */
  const windowedPoints = useMemo(() => {
    const safeStart = clamp(windowStart, 0, maxWindowStart);
    const slice = corePoints.slice(safeStart, safeStart + VISIBLE);
    return [padStartPoint, ...slice, padEndPoint];
  }, [corePoints, windowStart, maxWindowStart, padStartPoint, padEndPoint]);

  /**
   * タグフィルタ：選択外は value:null にして点/ラベルを消し、線も切る
   * ※“表示窓”に対して適用
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
   */
  const sliderItems = useMemo(() => {
    return filteredData.filter(
      (p) => !p.isPad && !p.isDraft && typeof p.value === 'number' && p.user,
    );
  }, [filteredData]);

  /**
   * 2) 無限ロード：古い側（左側）の残りが THRESHOLD 以下になったら追加取得
   */
  useEffect(() => {
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

    const need = Math.max(0, STOCK_TARGET - leftRemaining);
    if (need === 0) return;

    fetchingRef.current = true;
    try {
      const page = fetchOlder(before, need);

      beforeIndexRef.current = page.nextBefore;
      hasMoreRef.current = page.hasMore;

      const olderItems = page.items; // 古い→新しい
      const addCount = olderItems.length;

      if (addCount > 0) {
        setPoints((prev) => {
          const prevCore = prev.filter((p) => !p.isPad);
          return [padStartPoint, ...olderItems, ...prevCore, padEndPoint];
        });

        setWindowStart((s) => s + addCount);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [
    fetchOlder,
    windowStart,
    padStartPoint,
    padEndPoint,
    setWindowStart,
    panningRef,
  ]);

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

  return {
    // config-ish
    padStartTime,
    padEndTime,

    // states
    selectedTag,
    setSelectedTag,
    selectedTagRef,

    points,
    setPoints,
    pointsRef,

    windowStart,
    setWindowStart,

    // derived
    corePoints,
    maxWindowStart,
    windowedPoints,
    filteredData,
    filteredDataRef,
    sliderItems,

    // helpers
    findPointByTime,
    updatePointByTime,
  };
}
