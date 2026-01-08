import { MouseDownEvent } from '../recharts/mouseDown.types';

// MouseEvent からチャート内座標（CSS transform scale 考慮）を計算
export function getChartPointerFromMouseEvent(
  e: MouseDownEvent | undefined,
): { x: number; y: number } | null {
  if (!e) return null;

  // React.MouseEvent 互換として最低限だけ取り出す
  const evt = e as unknown as {
    clientX?: number;
    clientY?: number;
    currentTarget?: {
      getBoundingClientRect?: () => DOMRect;
      offsetWidth?: number;
      offsetHeight?: number;
    };
  };

  if (typeof evt.clientX !== 'number' || typeof evt.clientY !== 'number')
    return null;
  const ct = evt.currentTarget;
  if (!ct?.getBoundingClientRect) return null;

  const rect = ct.getBoundingClientRect();
  const ow = ct.offsetWidth ?? rect.width;
  const oh = ct.offsetHeight ?? rect.height;

  const scaleX = ow ? rect.width / ow : 1;
  const scaleY = oh ? rect.height / oh : 1;

  return {
    x: Math.round((evt.clientX - rect.left) / scaleX),
    y: Math.round((evt.clientY - rect.top) / scaleY),
  };
}
