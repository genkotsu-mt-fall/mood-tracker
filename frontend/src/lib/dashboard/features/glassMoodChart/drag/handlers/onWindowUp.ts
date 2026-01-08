import { clamp } from '@/lib/dashboard/utils/math/clamp';
import { DragSession } from '../types/DragSession';
import { ClickSeed } from '../../interactions/click/clickSeed';
import { VISIBLE } from '../../constants';

export type CreateOnWindowUpDeps = {
  dragRef: React.RefObject<DragSession | null>;
  panningRef: React.RefObject<boolean>;
  maxWindowStart: number;
  detachWindowDragListeners: () => void;
  setWindowStart: React.Dispatch<React.SetStateAction<number>>;
  tryInsertByClick: (seed: ClickSeed) => void;
};

export function createOnWindowUp(deps: CreateOnWindowUpDeps) {
  return function onWindowUp() {
    const session = deps.dragRef.current;
    deps.dragRef.current = null;
    deps.panningRef.current = false;
    deps.detachWindowDragListeners();

    if (!session) return;

    if (session.isDragging) {
      // パン終了：10件単位にスナップ（0-10, 10-20, ... を再現）
      deps.setWindowStart((s) => {
        const snapped = Math.round(s / VISIBLE) * VISIBLE;
        return clamp(snapped, 0, deps.maxWindowStart);
      });
      return;
    }

    // ドラッグでなかった＝クリック：中間点追加ロジック
    if (session.clickSeed) {
      deps.tryInsertByClick(session.clickSeed);
    }
  };
}
