import type { StackedPoint } from './types';
import { BANDS } from './bands';

export function normalizeStackedPoints(data: StackedPoint[]): StackedPoint[] {
  return data.map((p) => {
    const filled = { ...p } as Record<string, unknown>;
    for (const { key } of BANDS) {
      if (typeof filled[key] !== 'number') filled[key] = 0;
    }
    if (typeof filled.value !== 'number') filled.value = 0;
    return filled as StackedPoint;
  });
}
