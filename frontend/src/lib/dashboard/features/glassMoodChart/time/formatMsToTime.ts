export function formatMsToTime(ms: number): string {
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const HH = pad2(d.getHours());
  const MM = pad2(d.getMinutes());
  return `${yyyy}/${mm}/${dd} ${HH}:${MM}`;
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}
