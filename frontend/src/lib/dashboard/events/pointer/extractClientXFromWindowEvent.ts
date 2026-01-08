export function extractClientXFromWindowEvent(
  ev: MouseEvent | TouchEvent,
): number | null {
  if ('touches' in ev) {
    const t = ev.touches?.[0] ?? ev.changedTouches?.[0];
    return typeof t?.clientX === 'number' ? t.clientX : null;
  }
  return typeof (ev as MouseEvent).clientX === 'number'
    ? (ev as MouseEvent).clientX
    : null;
}
