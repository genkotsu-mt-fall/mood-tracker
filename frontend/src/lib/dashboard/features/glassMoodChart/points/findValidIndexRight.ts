import { ChartPoint } from '@/app/dashboard/_components/GlassMoodChart.model';

export function findValidIndexRight(
  arr: ChartPoint[],
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
