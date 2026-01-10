import { ChartPointUI } from '../model';

export function findValidIndexRight<T extends ChartPointUI>(
  arr: T[],
  start: number,
): number | null {
  for (let i = start; i < arr.length; i++) {
    const p = arr[i];
    if (!p) continue;
    if (p.isPad) continue;
    if (typeof p.value !== 'number') continue;
    return i;
  }
  return null;
}
