import { PAD_START, PAD_END } from '../model';

/**
 * "yyyy/MM/dd HH:mm" を安全に parse（環境依存の Date.parse を避ける）
 */
export function parseTimeToMs(s: string): number | null {
  if (!s || s === PAD_START || s === PAD_END) return null;
  // 例: 2026/01/02 09:00
  const [d, t] = s.split(' ');
  if (!d || !t) return null;
  const [yyyy, mm, dd] = d.split('/').map((x) => Number.parseInt(x, 10));
  const [HH, MM] = t.split(':').map((x) => Number.parseInt(x, 10));
  if (![yyyy, mm, dd, HH, MM].every((n) => Number.isFinite(n))) return null;

  // month は 0-based
  const dt = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, HH ?? 0, MM ?? 0, 0, 0);
  const ms = dt.getTime();
  return Number.isFinite(ms) ? ms : null;
}
