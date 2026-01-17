// frontend/src/lib/dashboard/features/glassMoodChart/spec/defaults/pointSpec.chartPointUI.ts
import type { ChartPointUI } from '../../model';
import type { PointSpec } from '../pointSpec';

/**
 * 互換デフォルト：ChartPointUI をそのまま解釈する spec
 */
export function createChartPointUISpec(): PointSpec<ChartPointUI> {
  return {
    isPad: (p) => !!p.isPad,
    isDraft: (p) => !!p.isDraft,
    clearDraft: (p) => ({ ...p, isDraft: false }),
    getValue: (p) => p.value,
    getTags: (p) => p.tags,
  };
}
