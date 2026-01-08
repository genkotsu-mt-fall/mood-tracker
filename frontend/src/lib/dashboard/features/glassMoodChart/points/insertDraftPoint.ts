import { ChartPoint } from '@/app/dashboard/_components/GlassMoodChart.model';
import { parseTimeToMs } from '../time/parseTimeToMs';

export function insertDraftPoint(
  draft: ChartPoint,
  setPoints: React.Dispatch<React.SetStateAction<ChartPoint[]>>,
) {
  setPoints((prev) => {
    const cleaned = prev.filter((p) => !p.isDraft);

    // 既に同時刻があるなら insert しない（編集に切り替える）
    const exists = cleaned.some((p) => !p.isPad && p.time === draft.time);
    if (exists) return cleaned;

    const draftMs = parseTimeToMs(draft.time);
    if (draftMs == null) return cleaned;

    // PAD_END の直前に入るよう、時刻でソート位置を決定
    const insertAt = (() => {
      for (let i = 0; i < cleaned.length; i++) {
        const p = cleaned[i];
        if (p.isPad) continue;
        const ms = parseTimeToMs(p.time);
        if (ms == null) continue;
        if (ms > draftMs) return i;
      }
      // 見つからなければ PAD_END の直前
      return Math.max(0, cleaned.length - 1);
    })();

    return [...cleaned.slice(0, insertAt), draft, ...cleaned.slice(insertAt)];
  });
}
