export type BandKey = 'b0_15' | 'b15_30' | 'b30_50' | 'b50_75' | 'b75_100';

export const BANDS: ReadonlyArray<{ key: BandKey; fill: string }> = [
  { key: 'b0_15', fill: '#2563EB' },
  { key: 'b15_30', fill: '#93C5FD' },
  { key: 'b30_50', fill: '#FACC15' },
  { key: 'b50_75', fill: '#FB923C' },
  { key: 'b75_100', fill: '#F87171' },
];

export const Y_TICKS = [0, 15, 30, 50, 75, 100] as const;
export const CHART_MARGIN = { top: 8, right: 12, left: 12, bottom: 8 } as const;

export function clamp100(x: unknown) {
  const n = typeof x === 'number' ? x : 0;
  return Math.max(0, Math.min(100, n));
}

/** 値 v が [low, high) の帯にどれだけ含まれるか（高さ） */
export function bandHeight(v: number, low: number, high: number) {
  const vv = clamp100(v);
  return Math.max(0, Math.min(vv, high) - low);
}

export function bandOf(value?: number) {
  const v = typeof value === 'number' ? value : 0;
  if (v < 15) return { low: 0, high: 15, color: '#2563EB', label: 'Very low' };
  if (v < 30) return { low: 15, high: 30, color: '#93C5FD', label: 'Low' };
  if (v < 50) return { low: 30, high: 50, color: '#FACC15', label: 'Mid' };
  if (v < 75) return { low: 50, high: 75, color: '#FB923C', label: 'High' };
  return { low: 75, high: 100, color: '#F87171', label: 'Very high' };
}
