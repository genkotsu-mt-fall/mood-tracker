import { MouseDownEvent } from '../recharts/mouseDown.types';

export function extractClientXFromMouseDownEvent(
  e: MouseDownEvent | undefined,
): number | null {
  if (!e) return null;
  const evt = e as unknown as { clientX?: number };
  return typeof evt.clientX === 'number' ? evt.clientX : null;
}
