import type React from 'react';
import { clamp } from '@/lib/dashboard/utils/math/clamp';

import { findValidIndexLeft } from './findValidIndexLeft';
import { findValidIndexRight } from './findValidIndexRight';
import { uniqueTags } from '../tags/uniqueTags';
import { insertDraftPoint } from './insertDraftPoint';

import type { EditPopoverState } from '../popover/useEditPopoverState';
import type { ClickSeed } from '../interactions/click/clickSeed';
import type { FilterTag } from '../model';
import type { PointKeySpec } from '../spec/pointKeySpec';
import type { PointXSpec } from '../spec/pointXSpec';
import type { PointDraftSpec } from '../spec/pointDraftSpec';
import type { PointSpec } from '../spec/pointSpec';

export type TryInsertByClickDeps<TPoint, X> = {
  pointsRef: React.RefObject<TPoint[]>;
  filteredDataRef: React.RefObject<TPoint[]>;
  selectedTagRef: React.RefObject<FilterTag>;
  setPoints: React.Dispatch<React.SetStateAction<TPoint[]>>;
  setEditPopover: React.Dispatch<React.SetStateAction<EditPopoverState | null>>;

  xSpec: PointXSpec<TPoint, X>;
  keySpec: PointKeySpec<TPoint>;
  draftSpec: PointDraftSpec<TPoint, X>;
  pointSpec: PointSpec<TPoint>;
};

/**
 * クリック（＝ドラッグでなかった場合）にだけ実行する、中間点作成ロジック
 */
export function createTryInsertByClick<TPoint, X>(
  deps: TryInsertByClickDeps<TPoint, X>,
) {
  const eq = deps.xSpec.equals ?? Object.is;

  return function tryInsertByClick(seed: ClickSeed) {
    const points = deps.pointsRef.current;
    const filteredData = deps.filteredDataRef.current;
    const selectedTag = deps.selectedTagRef.current;

    const { pointerX, activeIdx, activeX, anchorY } = seed;

    // クリックが最寄りtickの右側/左側か（pointerX と activeX を比較）
    const rightSide = pointerX > activeX;
    const seedLeft = rightSide ? activeIdx : activeIdx - 1;
    const seedRight = rightSide ? activeIdx + 1 : activeIdx;

    const leftIdx = findValidIndexLeft(filteredData, seedLeft, deps.pointSpec);
    const rightIdx = findValidIndexRight(
      filteredData,
      seedRight,
      deps.pointSpec,
    );
    if (leftIdx == null || rightIdx == null) return;

    const left = filteredData[leftIdx];
    const right = filteredData[rightIdx];
    if (!left || !right) return;

    // xSpec で中間Xを作る
    const xL = deps.xSpec.getX(left);
    const xR = deps.xSpec.getX(right);

    const midX = deps.xSpec.mid(xL, xR);
    if (midX == null) return;

    // 丸め等の結果、左右と一致したらやめる
    if (eq(midX, xL) || eq(midX, xR)) return;

    const anchor = { x: activeX, y: anchorY };

    // 同じXが既にあるなら、その点の key を開く
    const existsPoint = points.find(
      (p) => !deps.pointSpec.isPad(p) && eq(deps.xSpec.getX(p), midX),
    );

    if (existsPoint) {
      deps.setEditPopover({ key: deps.keySpec.getKey(existsPoint), anchor });
      return;
    }

    // 仮値：左右の value の平均
    const vL = deps.pointSpec.getValue(left as TPoint);
    const vR = deps.pointSpec.getValue(right as TPoint);
    const midValue =
      typeof vL === 'number' && typeof vR === 'number'
        ? clamp(Math.round((vL + vR) / 2), 0, 100)
        : 50;

    const leftTags = deps.pointSpec.getTags(left as TPoint) ?? [];
    const rightTags = deps.pointSpec.getTags(right as TPoint) ?? [];

    const tags =
      selectedTag === 'All'
        ? uniqueTags([...leftTags, ...rightTags])
        : [selectedTag as unknown as string];

    // draft生成は draftSpec に任せる
    const draft = deps.draftSpec.createDraft({
      x: midX,
      value: midValue,
      tags,
      left: left as TPoint,
      right: right as TPoint,
    });

    insertDraftPoint(draft, deps.setPoints, deps.xSpec, deps.pointSpec);

    deps.setEditPopover({ key: deps.keySpec.getKey(draft), anchor });
  };
}
