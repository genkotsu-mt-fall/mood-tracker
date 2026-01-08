import { isEventFromSelector } from '../../events/dom/hitTest';
import { MouseDownEvent } from '../../events/recharts/mouseDown.types';
import { GMC_DOT_SELECTOR } from './domContracts';

export function isEventFromDot(e: MouseDownEvent | undefined): boolean {
  if (!e) return false;
  return isEventFromSelector(e, GMC_DOT_SELECTOR);
}
