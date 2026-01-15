'use client';

import React, { useId, useRef } from 'react';
import { useEditPopoverState } from '@/lib/dashboard/features/glassMoodChart/popover/useEditPopoverState';
import {
  FetchLatest,
  FetchOlder,
  useGlassMoodChartData,
} from '@/lib/dashboard/features/glassMoodChart/data/useGlassMoodChartData';
import { useGlassMoodChartUX } from '@/lib/dashboard/features/glassMoodChart/ux/useGlassMoodChartUX';
import { ChartPointUI, FilterTag } from '../model';
import { createTimeKeySpec, type PointKeySpec } from '../spec/pointKeySpec';
import { createTimeXSpec, type PointXSpec } from '../spec/pointXSpec';

// ✅ STEP-2.5
import {
  createChartPointUITimeDraftSpec,
  type PointDraftSpec,
} from '../spec/pointDraftSpec';
// ✅ STEP-3
import { createChartPointUISpec, type PointSpec } from '../spec/pointSpec';
// fallback user（今はダミーを利用。後で本番の viewer に差し替え）
import { users } from '@/app/dashboard/_components/GlassMoodChart.dummy';

type Args = {
  padStartTime: string;
  padEndTime: string;
  filterTags: readonly FilterTag[];
  fetchLatest: FetchLatest<ChartPointUI>;
  fetchOlder: FetchOlder<ChartPointUI>;
  // ✅ STEP-1: 呼び出し側で差し替え可能に
  keySpec?: PointKeySpec<ChartPointUI>;
  xSpec?: PointXSpec<ChartPointUI, string>;
  draftSpec?: PointDraftSpec<ChartPointUI, string>;

  // ✅ STEP-3
  pointSpec?: PointSpec<ChartPointUI>;
};

export function useGlassMoodChartController({
  padStartTime,
  padEndTime,
  filterTags,
  fetchLatest,
  fetchOlder,
  keySpec: injectedKeySpec,
  xSpec: injectedXSpec,
  draftSpec: injectedDraftSpec,
  pointSpec: injectedPointSpec,
}: Args) {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `strokeGrad-${uid}`;
  const pillShadowId = `pillShadow-${uid}`;

  const { editPopover, setEditPopover } = useEditPopoverState();

  // Data と共有（ドラッグ中のデータ取得抑止）
  const panningRef = useRef<boolean>(false);

  // ✅ デフォルトは現状互換（time を key とする）
  const keySpec = injectedKeySpec ?? createTimeKeySpec<ChartPointUI>();
  const xSpec = injectedXSpec ?? createTimeXSpec<ChartPointUI>();

  // ✅ STEP-2.5: デフォルト draftSpec（互換：timeにxを入れる）
  const draftSpec =
    injectedDraftSpec ??
    createChartPointUITimeDraftSpec({
      fallbackUser: users.u1,
      emoji: '✍️',
    });

  // ✅ STEP-3: デフォルトは ChartPointUI の素直な解釈
  const pointSpec = injectedPointSpec ?? createChartPointUISpec();

  const data = useGlassMoodChartData({
    padStartTime,
    padEndTime,
    fetchLatest,
    fetchOlder,
    keySpec,
    panningRef,
  });

  const ux = useGlassMoodChartUX({
    windowStart: data.windowStart,
    setWindowStart: data.setWindowStart,
    maxWindowStart: data.maxWindowStart,

    pointsRef: data.pointsRef,
    filteredDataRef: data.filteredDataRef,
    selectedTagRef:
      data.selectedTagRef as unknown as React.RefObject<FilterTag>,
    setPoints: data.setPoints,
    // keySpec を注入
    keySpec,
    xSpec,
    draftSpec,

    // ✅ STEP-3
    pointSpec,
    findPointByKey: data.findPointByKey,

    panningRef,

    editPopover,
    setEditPopover,
  });

  return {
    // ids
    strokeGradId,
    pillShadowId,

    // padding
    padStartTime,
    padEndTime,

    // tags
    filterTags,
    selectedTag: data.selectedTag,
    onSelectTag: data.setSelectedTag,

    // chart
    filteredData: data.filteredData,
    onChartMouseDown: ux.handleChartMouseDown,
    onPointClick: ux.handlePointClick,

    // editor
    editPopover,
    editPoint: ux.editPoint,
    isEditingDraft: ux.isEditingDraft,
    onCancelEditor: ux.cancelEditor,
    onSaveEditor: ux.saveEditor,
    // ✅ key版（ただし今は key===time）
    onUpdatePoint: data.updatePointByKey,

    // slider
    sliderItems: data.sliderItems,
  };
}
