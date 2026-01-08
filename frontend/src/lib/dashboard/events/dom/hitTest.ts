export function isEventFromSelector(e: unknown, selector: string): boolean {
  const target = (e as { target?: Element | null }).target ?? null;
  if (!target?.closest) return false;
  return !!target.closest(selector);
}
