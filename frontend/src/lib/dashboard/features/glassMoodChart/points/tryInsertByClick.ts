import { users } from '@/app/dashboard/_components/GlassMoodChart.dummy';
import {
  ChartPoint,
  FilterTag,
} from '@/app/dashboard/_components/GlassMoodChart.model';
import { findValidIndexLeft } from './findValidIndexLeft';
import { findValidIndexRight } from './findValidIndexRight';
import { parseTimeToMs } from '../time/parseTimeToMs';
import { roundToMinute } from '../time/roundToMinute';
import { formatMsToTime } from '../time/formatMsToTime';
import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { uniqueTags } from '../tags/uniqueTags';
import { insertDraftPoint } from './insertDraftPoint';
import { EditPopoverState } from '../popover/useEditPopoverState';
import { ClickSeed } from '../interactions/click/clickSeed';

export type TryInsertByClickDeps = {
  pointsRef: React.RefObject<ChartPoint[]>;
  filteredDataRef: React.RefObject<ChartPoint[]>;
  selectedTagRef: React.RefObject<FilterTag>;
  setPoints: React.Dispatch<React.SetStateAction<ChartPoint[]>>;
  setEditPopover: React.Dispatch<React.SetStateAction<EditPopoverState | null>>;
};

/**
 * クリック（＝ドラッグでなかった場合）にだけ実行する、既存の「中間点を作る」ロジック
 */
export function createTryInsertByClick(deps: TryInsertByClickDeps) {
  return function tryInsertByClick(seed: ClickSeed) {
    const points = deps.pointsRef.current;
    const filteredData = deps.filteredDataRef.current;
    const selectedTag = deps.selectedTagRef.current;

    const { pointerX, activeIdx, activeX, anchorY } = seed;

    // クリックが最寄りtickの右側/左側か（pointerX と activeX を比較）
    const rightSide = pointerX > activeX;
    const seedLeft = rightSide ? activeIdx : activeIdx - 1;
    const seedRight = rightSide ? activeIdx + 1 : activeIdx;

    const leftIdx = findValidIndexLeft(filteredData, seedLeft);
    const rightIdx = findValidIndexRight(filteredData, seedRight);
    if (leftIdx == null || rightIdx == null) return;

    const left = filteredData[leftIdx];
    const right = filteredData[rightIdx];
    if (!left || !right) return;

    const tL = parseTimeToMs(left.time);
    const tR = parseTimeToMs(right.time);
    if (tL == null || tR == null) return;
    if (tR <= tL) return;

    // 中間（距離の半分）
    const midMsRaw = (tL + tR) / 2;
    const midMs = roundToMinute(midMsRaw);
    const midTime = formatMsToTime(midMs);

    // 丸めで左右と一致したらやめる
    if (midTime === left.time || midTime === right.time) return;

    const exists = points.some((p) => !p.isPad && p.time === midTime);
    const anchor = { x: activeX, y: anchorY };

    if (exists) {
      deps.setEditPopover({ time: midTime, anchor });
      return;
    }

    // 仮値：左右の value の平均
    const vL = left.value;
    const vR = right.value;
    const midValue =
      typeof vL === 'number' && typeof vR === 'number'
        ? clamp(Math.round((vL + vR) / 2), 0, 100)
        : 50;

    const tags =
      selectedTag === 'All'
        ? uniqueTags([...(left.tags ?? []), ...(right.tags ?? [])])
        : [selectedTag];

    const draft: ChartPoint = {
      time: midTime,
      value: midValue,
      emoji: '✍️',
      tags,
      user: left.user ?? right.user ?? users.u1,
      isDraft: true,
    };

    insertDraftPoint(draft, deps.setPoints);
    deps.setEditPopover({ time: midTime, anchor });
  };
}
