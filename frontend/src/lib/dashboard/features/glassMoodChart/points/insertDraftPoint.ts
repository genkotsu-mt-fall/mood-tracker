import type React from 'react';
import type { PointXSpec } from '../spec/pointXSpec';
import type { PointSpec } from '../spec/pointSpec';

export function insertDraftPoint<TPoint, X>(
  draft: TPoint,
  setPoints: React.Dispatch<React.SetStateAction<TPoint[]>>,
  xSpec: PointXSpec<TPoint, X>,
  pointSpec: PointSpec<TPoint>,
) {
  const eq = xSpec.equals ?? Object.is;

  setPoints((prev) => {
    // 既存の draft は排除（「同時に1つだけ」設計）
    const cleaned = prev.filter((p) => !pointSpec.isDraft(p));

    const draftX = xSpec.getX(draft);

    // 既に同じXがあるなら insert しない（編集に切り替える）
    const exists = cleaned.some(
      (p) => !pointSpec.isPad(p) && eq(xSpec.getX(p), draftX),
    );
    if (exists) return cleaned;

    // PAD_END の直前に入るよう、X比較でソート位置を決定
    const insertAt = (() => {
      for (let i = 0; i < cleaned.length; i++) {
        const p = cleaned[i];
        if (!p) continue;
        if (pointSpec.isPad(p)) continue;

        const r = xSpec.compare(xSpec.getX(p), draftX);
        if (r == null) continue;

        if (r > 0) return i;
      }
      return Math.max(0, cleaned.length - 1);
    })();

    return [...cleaned.slice(0, insertAt), draft, ...cleaned.slice(insertAt)];
  });
}
