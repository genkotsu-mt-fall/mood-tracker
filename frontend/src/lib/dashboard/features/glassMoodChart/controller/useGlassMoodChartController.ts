'use client';

import React, { useId, useRef } from 'react';

import type { FilterTag } from '@/app/dashboard/_components/GlassMoodChart.model';

import { useEditPopoverState } from '@/lib/dashboard/features/glassMoodChart/popover/useEditPopoverState';
import {
  FetchLatest,
  FetchOlder,
  useGlassMoodChartData,
} from '@/lib/dashboard/features/glassMoodChart/data/useGlassMoodChartData';
import { useGlassMoodChartUX } from '@/lib/dashboard/features/glassMoodChart/ux/useGlassMoodChartUX';

type Args = {
  padStartTime: string;
  padEndTime: string;
  filterTags: readonly FilterTag[];
  fetchLatest: FetchLatest;
  fetchOlder: FetchOlder;
};

export function useGlassMoodChartController({
  padStartTime,
  padEndTime,
  filterTags,
  fetchLatest,
  fetchOlder,
}: Args) {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `strokeGrad-${uid}`;
  const pillShadowId = `pillShadow-${uid}`;

  const { editPopover, setEditPopover } = useEditPopoverState();

  // Data と共有（ドラッグ中のデータ取得抑止）
  const panningRef = useRef<boolean>(false);

  const data = useGlassMoodChartData({
    padStartTime,
    padEndTime,
    fetchLatest,
    fetchOlder,
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
    findPointByTime: data.findPointByTime,

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
    onUpdatePoint: data.updatePointByTime,

    // slider
    sliderItems: data.sliderItems,
  };
}
