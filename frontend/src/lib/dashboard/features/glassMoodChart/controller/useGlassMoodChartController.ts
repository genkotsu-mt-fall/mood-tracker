'use client';

import { useId, useRef } from 'react';
import { useEditPopoverState } from '@/lib/dashboard/features/glassMoodChart/popover/useEditPopoverState';
import type {
  DataPointLike,
  FetchLatest,
  FetchOlder,
} from '@/lib/dashboard/features/glassMoodChart/data/useGlassMoodChartData';
import { useGlassMoodChartData } from '@/lib/dashboard/features/glassMoodChart/data/useGlassMoodChartData';
import { useGlassMoodChartUX } from '@/lib/dashboard/features/glassMoodChart/ux/useGlassMoodChartUX';
import type { FilterTag } from '../model';
import type { PointDraftSpec } from '../spec/pointDraftSpec';
import type { PointSpec } from '../spec/pointSpec';
import type { PointKeySpec } from '../spec/pointKeySpec';
import type { PointXSpec } from '../spec/pointXSpec';

type Args<TPoint, X> = {
  padStartTime: string;
  padEndTime: string;
  filterTags: readonly FilterTag[];
  fetchLatest: FetchLatest<TPoint>;
  fetchOlder: FetchOlder<TPoint>;

  keySpec: PointKeySpec<TPoint>;
  xSpec: PointXSpec<TPoint, X>;

  draftSpec: PointDraftSpec<TPoint, X>;
  pointSpec: PointSpec<TPoint>;
};

export function useGlassMoodChartController<
  TPoint extends DataPointLike,
  X = string,
>({
  padStartTime,
  padEndTime,
  filterTags,
  fetchLatest,
  fetchOlder,
  keySpec,
  xSpec,
  draftSpec,
  pointSpec,
}: Args<TPoint, X>) {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `strokeGrad-${uid}`;
  const pillShadowId = `pillShadow-${uid}`;

  const { editPopover, setEditPopover } = useEditPopoverState();

  const panningRef = useRef<boolean>(false);

  const data = useGlassMoodChartData<TPoint>({
    padStartTime,
    padEndTime,
    fetchLatest,
    fetchOlder,
    keySpec,
    panningRef,
  });

  const ux = useGlassMoodChartUX<TPoint, X>({
    windowStart: data.windowStart,
    setWindowStart: data.setWindowStart,
    maxWindowStart: data.maxWindowStart,

    pointsRef: data.pointsRef,
    filteredDataRef: data.filteredDataRef,
    selectedTagRef: data.selectedTagRef,
    setPoints: data.setPoints,

    keySpec,
    xSpec,
    draftSpec,
    pointSpec,
    findPointByKey: data.findPointByKey,

    panningRef,

    editPopover,
    setEditPopover,
  });

  return {
    strokeGradId,
    pillShadowId,

    padStartTime,
    padEndTime,

    filterTags,
    selectedTag: data.selectedTag,
    onSelectTag: data.setSelectedTag,

    filteredData: data.filteredData,
    onChartMouseDown: ux.handleChartMouseDown,
    onPointClick: ux.handlePointClick,

    editPopover,
    editPoint: ux.editPoint,
    isEditingDraft: ux.isEditingDraft,
    onCancelEditor: ux.cancelEditor,
    onSaveEditor: ux.saveEditor,

    onUpdatePoint: data.updatePointByKey,

    // slider
    sliderItems: data.sliderItems,
  };
}
