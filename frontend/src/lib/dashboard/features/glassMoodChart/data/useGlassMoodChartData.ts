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
import { FilterTag, UserSummary } from '../model';
import type { PointKeySpec } from '../spec/pointKeySpec';

export type GlassMoodChartPage<T> = {
  items: T[]; // 古い→新しい
  nextBefore: number | null;
  hasMore: boolean;
};

export type FetchLatest<T> = (stockTarget: number) => GlassMoodChartPage<T>;
export type FetchOlder<T> = (
  before: number,
  need: number,
) => GlassMoodChartPage<T>;

export type DataPointLike = {
  time: string;
  value: number | null;
  tags?: string[];
  user?: UserSummary;
  isPad?: boolean;
  isDraft?: boolean;
};

type Args<T extends DataPointLike> = {
  padStartTime: string;
  padEndTime: string;
  fetchLatest: FetchLatest<T>;
  fetchOlder: FetchOlder<T>;

  // ✅ STEP-1: キー特定ロジックを注入
  keySpec: PointKeySpec<T>;

  // UX 側と共有（ドラッグ中はデータ取得を抑止）
  panningRef: React.RefObject<boolean>;
};

export function useGlassMoodChartData<T extends DataPointLike>({
  padStartTime,
  padEndTime,
  fetchLatest,
  fetchOlder,
  keySpec,
  panningRef,
}: Args<T>) {
  // ✅ pad 点も “T として” 扱う（最低限の形を作って T にキャスト）
  const padStartPoint = useMemo<T>(
    () => ({ time: padStartTime, value: null, isPad: true }) as unknown as T,
    [padStartTime],
  );
  const padEndPoint = useMemo<T>(
    () => ({ time: padEndTime, value: null, isPad: true }) as unknown as T,
    [padEndTime],
  );

  const { windowStart, setWindowStart } = useViewRangeStartState();

  const [selectedTag, setSelectedTag] = useState<FilterTag>('All');
  const selectedTagRef = useLatestRef(selectedTag);

  // ✅ state を DataPointLike[] ではなく “T[]” にする
  const [points, setPoints] = useState<T[]>([padStartPoint, padEndPoint]);
  const pointsRef = useLatestRef(points);

  const beforeIndexRef = useRef<number | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const fetchingRef = useRef<boolean>(false);

  useEffect(() => {
    const page = fetchLatest(STOCK_TARGET);
    const core = page.items; // 古い→新しい

    beforeIndexRef.current = page.nextBefore;
    hasMoreRef.current = page.hasMore;

    setPoints([padStartPoint, ...core, padEndPoint]);

    const start = Math.max(0, core.length - VISIBLE);
    setWindowStart(start);
  }, [fetchLatest, padStartPoint, padEndPoint, setWindowStart]);

  const corePoints = useMemo(() => points.filter((p) => !p.isPad), [points]);

  const maxWindowStart = useMemo(
    () => Math.max(0, corePoints.length - VISIBLE),
    [corePoints.length],
  );

  const windowedPoints = useMemo(() => {
    const safeStart = clamp(windowStart, 0, maxWindowStart);
    const slice = corePoints.slice(safeStart, safeStart + VISIBLE);
    return [padStartPoint, ...slice, padEndPoint];
  }, [corePoints, windowStart, maxWindowStart, padStartPoint, padEndPoint]);

  const filteredData = useMemo(() => {
    if (selectedTag === 'All') return windowedPoints;

    // ✅ “value null 化” は T を保つためにキャストで戻す
    return windowedPoints.map((p) => {
      if (p.isPad) return p;
      const hit = (p.tags ?? []).includes(selectedTag);
      if (hit) return p;
      return { ...p, value: null };
    });
  }, [windowedPoints, selectedTag]);

  const filteredDataRef = useLatestRef(filteredData);

  const sliderItems = useMemo(() => {
    return filteredData.filter(
      (p) => !p.isPad && !p.isDraft && typeof p.value === 'number' && !!p.user,
    );
  }, [filteredData]);

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

  function findPointByKey(key: string): T | undefined {
    return points.find((p) => !p.isPad && keySpec.getKey(p) === key);
  }

  function updatePointByKey(key: string, patch: Partial<T>) {
    setPoints((prev) =>
      prev.map((p) => {
        if (p.isPad) return p;
        if (keySpec.getKey(p) !== key) return p;
        return { ...p, ...patch } as T;
      }),
    );
  }

  return {
    padStartTime,
    padEndTime,

    selectedTag,
    setSelectedTag,
    selectedTagRef,

    points,
    setPoints,
    pointsRef,

    windowStart,
    setWindowStart,

    corePoints,
    maxWindowStart,
    windowedPoints,
    filteredData,
    filteredDataRef,
    sliderItems,

    findPointByKey,
    updatePointByKey,

    keySpec,
  };
}
