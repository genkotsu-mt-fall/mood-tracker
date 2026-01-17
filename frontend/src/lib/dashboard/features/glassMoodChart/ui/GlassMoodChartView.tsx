'use client';

import React from 'react';

import FilterTagChips from '@/lib/dashboard/features/glassMoodChart/tags/FilterTagChips';
import EditPointPopover, {
  type EditPointLike,
  type EditPointPatch,
} from '@/lib/dashboard/features/glassMoodChart/popover/EditPointPopover';
import UserMiniCardSlider from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCardSlider';
import type { UserMiniCardPoint } from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCard';

import type { FilterTag } from '../model';
import type { EditPopoverState } from '../popover/useEditPopoverState';

type ViewPointLike = UserMiniCardPoint & {
  isDraft?: boolean;
  isPad?: boolean;
};

export type GlassMoodChartViewProps<TPoint extends ViewPointLike> = {
  // tag chips
  filterTags: readonly FilterTag[];
  selectedTag: FilterTag;
  onSelectTag: (t: FilterTag) => void;

  // editor
  editPopover: EditPopoverState | null;
  editPoint: TPoint | undefined;
  editPointSubtitle: string | null;
  isEditingDraft: boolean;
  onCancelEditor: () => void;
  onSaveEditor: () => void;
  // ✅ Popover と同じ更新契約にする
  onUpdatePoint: (key: string, patch: EditPointPatch) => void;

  // slider
  sliderItems: readonly TPoint[];
  getSliderItemKey: (p: TPoint) => string;
  getSliderItemSubtitle: (p: TPoint) => string;

  // chart slot
  children: React.ReactNode;
};

export default function GlassMoodChartView<TPoint extends ViewPointLike>(
  props: GlassMoodChartViewProps<TPoint>,
) {
  const popoverEditPoint: EditPointLike | undefined = props.editPoint
    ? {
        subtitle: props.editPointSubtitle ?? '',
        value: props.editPoint.value,
        emoji: props.editPoint.emoji ?? undefined,
        tags: props.editPoint.tags ?? undefined,
        isDraft: !!props.editPoint.isDraft,
        isPad: !!props.editPoint.isPad,
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
          <FilterTagChips
            tags={props.filterTags}
            selected={props.selectedTag}
            onSelect={props.onSelectTag}
          />

          <div className="flex-1 min-h-0">
            <div className="relative h-full cursor-grab active:cursor-grabbing">
              <EditPointPopover
                editPopover={props.editPopover}
                editPoint={popoverEditPoint}
                isEditingDraft={props.isEditingDraft}
                onCancel={props.onCancelEditor}
                onSave={props.onSaveEditor}
                onUpdate={props.onUpdatePoint}
              />

              {props.children}
            </div>
          </div>

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
