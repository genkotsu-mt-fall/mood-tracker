// frontend/src/lib/dashboard/features/glassMoodChart/spec/pointXSpec.ts
import { parseTimeToMs } from '../time/parseTimeToMs';
import { roundToMinute } from '../time/roundToMinute';
import { formatMsToTime } from '../time/formatMsToTime';

/**
 * X軸（横軸）の “契約”。
 * points層は「Xの比較」「中間Xの生成」だけできればよい。
 */
export type PointXSpec<T, X> = {
  /** 点からXを取り出す（例: p.time / p.createdAt） */
  getX: (p: T) => X;

  /** Xが同じか（未指定なら Object.is） */
  equals?: (a: X, b: X) => boolean;

  /**
   * Xの大小比較（a < b => negative, a > b => positive）
   * 比較不能なら null（例: パース失敗）
   */
  compare: (a: X, b: X) => number | null;

  /**
   * 中間Xを作る（作れないなら null）
   * 例: timeなら「msの中間→分丸め→文字列に戻す」
   */
  mid: (a: X, b: X) => X | null;
};

/**
 * 既存仕様（time: string）互換のデフォルトX spec
 */
export function createTimeXSpec<T extends { time: string }>(): PointXSpec<
  T,
  string
> {
  return {
    getX: (p) => p.time,
    equals: (a, b) => a === b,
    compare: (a, b) => {
      const ma = parseTimeToMs(a);
      const mb = parseTimeToMs(b);
      if (ma == null || mb == null) return null;
      return ma - mb;
    },
    mid: (a, b) => {
      const ma = parseTimeToMs(a);
      const mb = parseTimeToMs(b);
      if (ma == null || mb == null) return null;
      if (mb <= ma) return null;

      // 中間 → 分丸め → 文字列
      const midRaw = (ma + mb) / 2;
      const midRounded = roundToMinute(midRaw);
      return formatMsToTime(midRounded);
    },
  };
}
