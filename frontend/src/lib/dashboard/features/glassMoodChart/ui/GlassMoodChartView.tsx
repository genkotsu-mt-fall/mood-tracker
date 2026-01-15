'use client';

import React from 'react';

import FilterTagChips from '@/lib/dashboard/features/glassMoodChart/tags/FilterTagChips';
import EditPointPopover, {
  type EditPointLike,
} from '@/lib/dashboard/features/glassMoodChart/popover/EditPointPopover';
import UserMiniCardSlider from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCardSlider';

import type { ChartPointUI, FilterTag } from '../model';
import type { EditPopoverState } from '../popover/useEditPopoverState';

export type GlassMoodChartViewProps = {
  // tag chips
  filterTags: readonly FilterTag[];
  selectedTag: FilterTag;
  onSelectTag: (t: FilterTag) => void;

  // editor
  editPopover: EditPopoverState | null;
  editPoint: ChartPointUI | undefined;
  /** popover の subtitle（UIが time を知らないために文字列注入する） */
  editPointSubtitle: string | null;
  isEditingDraft: boolean;
  onCancelEditor: () => void;
  onSaveEditor: () => void;
  onUpdatePoint: (key: string, patch: Partial<ChartPointUI>) => void;

  // slider
  sliderItems: readonly ChartPointUI[];
  /** slider の React key（例: keySpec.getKey） */
  getSliderItemKey: (p: ChartPointUI) => string;
  /** slider の subtitle（例: p.time.slice(11)） */
  getSliderItemSubtitle: (p: ChartPointUI) => string;

  // chart slot
  children: React.ReactNode;
};

export default function GlassMoodChartView(props: GlassMoodChartViewProps) {
  const popoverEditPoint: EditPointLike | undefined = props.editPoint
    ? {
        subtitle: props.editPointSubtitle ?? '',
        value: props.editPoint.value,
        emoji: props.editPoint.emoji,
        tags: props.editPoint.tags,
        isDraft: props.editPoint.isDraft,
        isPad: props.editPoint.isPad,
      }
    : undefined;

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
          <FilterTagChips
            tags={props.filterTags}
            selected={props.selectedTag}
            onSelect={props.onSelectTag}
          />

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <div className="relative h-full cursor-grab active:cursor-grabbing">
              {/* Editor popover */}
              <EditPointPopover
                editPopover={props.editPopover}
                editPoint={popoverEditPoint}
                isEditingDraft={props.isEditingDraft}
                onCancel={props.onCancelEditor}
                onSave={props.onSaveEditor}
                onUpdate={props.onUpdatePoint}
              />

              {/* Injected chart */}
              {props.children}
            </div>
          </div>

          {/* User cards slider */}
          <UserMiniCardSlider
            items={props.sliderItems}
            getKey={props.getSliderItemKey}
            getSubtitle={props.getSliderItemSubtitle}
          />
        </div>
      </div>
    </div>
  );
}
