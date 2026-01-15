import type { PointSpec } from '../spec/pointSpec';

export function findValidIndexLeft<TPoint>(
  arr: readonly TPoint[],
  start: number,
  pointSpec: PointSpec<TPoint>,
): number | null {
  for (let i = start; i >= 0; i--) {
    const p = arr[i];
    if (!p) continue;
    if (pointSpec.isPad(p)) continue;

    const v = pointSpec.getValue(p as TPoint);
    if (typeof v !== 'number') continue;

    return i;
  }
  return null;
}
