// GlassMoodChart.dummy.ts
import {
  ChartPoint,
  UserSummary,
  PAD_END,
  PAD_START,
  FILTER_TAGS,
} from './GlassMoodChart.model';

/**
 * そのまま切り出し（ユーザー定義）
 */
export const users: Record<string, UserSummary> = {
  u1: { id: 'u1', name: 'Aoi Tanaka', handle: '@aoi', avatar: 'A' },
  u2: { id: 'u2', name: 'Ren Sato', handle: '@ren', avatar: 'R' },
  u3: { id: 'u3', name: 'Mina Kato', handle: '@mina', avatar: 'M' },
  u4: { id: 'u4', name: 'Haru Ito', handle: '@haru', avatar: 'H' },
};

/**
 * そのまま切り出し（初期表示用の少量サンプル）
 */
export const initialData: ChartPoint[] = [
  { time: PAD_START, value: null, isPad: true },

  {
    time: '2026/01/02 09:00',
    value: 5,
    emoji: '🙂',
    tags: ['Health'],
    user: users.u3,
  },
  {
    time: '2026/01/02 10:00',
    value: 40,
    emoji: '🥰',
    tags: ['Work'],
    user: users.u1,
  },
  {
    time: '2026/01/02 11:00',
    value: 25,
    emoji: '😌',
    tags: ['Work', 'Study'],
    user: users.u1,
  },
  {
    time: '2026/01/02 12:00',
    value: 70,
    emoji: '😏',
    tags: ['Study'],
    user: users.u2,
  },
  {
    time: '2026/01/02 13:00',
    value: 60,
    emoji: '☺️',
    tags: ['Family'],
    user: users.u4,
  },
  {
    time: '2026/01/02 14:00',
    value: 9,
    emoji: '🤯',
    tags: ['Health'],
    user: users.u3,
  },
  {
    time: '2026/01/02 15:00',
    value: 95,
    emoji: '😄',
    tags: ['Social'],
    user: users.u2,
  },
  {
    time: '2026/01/02 16:00',
    value: 78,
    emoji: '🤩',
    tags: ['Family', 'Social'],
    user: users.u4,
  },

  { time: PAD_END, value: null, isPad: true },
];

/* =====================================================================================
 * ここから「10000件をベタ書きしない」ための “ダミーDB（都度生成）”
 * ===================================================================================== */

/**
 * ダミー総件数（本当のDBの総件数に相当）
 */
export const DUMMY_TOTAL = 10_000;

/**
 * ダミー生成の設定
 * - newestMs: 一番新しいデータの時刻
 * - intervalMinutes: 何分刻みでデータが並ぶか
 * - seed: 乱数の固定（同じindexなら毎回同じ値になる）
 */
export type DummyOptions = {
  total?: number;
  newestMs?: number;
  intervalMinutes?: number;
  seed?: number;
};

const DEFAULT_OPTIONS: Required<DummyOptions> = {
  total: DUMMY_TOTAL,
  newestMs: new Date(2026, 0, 2, 16, 0, 0, 0).getTime(), // 2026/01/02 16:00 を基準にする
  intervalMinutes: 60,
  seed: 1337,
};

const EMOJIS = [
  '🙂',
  '🥰',
  '😌',
  '😏',
  '☺️',
  '🤯',
  '😄',
  '🤩',
  '😴',
  '😡',
  '🥳',
] as const;
const TAG_POOL = FILTER_TAGS.filter((t) => t !== 'All') as unknown as string[];

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatMsToTime(ms: number): string {
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const HH = pad2(d.getHours());
  const MM = pad2(d.getMinutes());
  return `${yyyy}/${mm}/${dd} ${HH}:${MM}`;
}

/**
 * seed付きの軽量PRNG（mulberry32）
 * 同じ seed を使う限り、同じ手順で同じ乱数列が得られる。
 */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickUnique<T>(
  arr: readonly T[],
  count: number,
  rng: () => number,
): T[] {
  const c = Math.max(0, Math.min(count, arr.length));
  const pool = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < c; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool[idx]!);
    pool.splice(idx, 1);
  }
  return out;
}

/**
 * ダミーデータの「i番目（0=最古、total-1=最新）」を生成する
 * ※重要：この方式だと “10000件を配列で持たなくても” 必要な分だけ生成できる
 */
export function makeDummyPointByIndex(
  i: number,
  opts?: DummyOptions,
): ChartPoint {
  const o = { ...DEFAULT_OPTIONS, ...(opts ?? {}) };
  const total = o.total;

  // 範囲外は守る（呼び出し側のバグを早く見つけるため）
  const idx = Math.max(0, Math.min(i, total - 1));

  // 最新から逆算して「最古の時刻」を決め、idx で前進（時刻は昇順になる）
  const intervalMs = o.intervalMinutes * 60_000;
  const oldestMs = o.newestMs - (total - 1) * intervalMs;
  const ms = oldestMs + idx * intervalMs;

  // indexごとに乱数列が固定になるよう seed を混ぜる
  const rng = mulberry32((o.seed + idx * 0x9e3779b9) >>> 0);

  const value = Math.round(rng() * 100);
  const emoji = EMOJIS[Math.floor(rng() * EMOJIS.length)] ?? '🙂';

  const userList = Object.values(users);
  const user = userList[Math.floor(rng() * userList.length)] ?? users.u1;

  const tagCount = rng() < 0.25 ? 2 : 1;
  const tags = pickUnique(TAG_POOL, tagCount, rng);

  return {
    time: formatMsToTime(ms),
    value,
    emoji,
    tags,
    user,
  };
}

/**
 * “DBっぽい”ページ取得
 * before は「この index より前（古い側）を取りたい」という境界（exclusive）
 * - 初回：before=total を渡す → 最新側のlimit件が返る
 * - 次回：返ってきた nextBefore を before に渡す → さらに古いlimit件が返る
 */
export type DummyPage = {
  items: ChartPoint[];
  nextBefore: number; // 次回呼ぶときの before
  hasMore: boolean;
};

export function fetchDummyLatest(
  limit: number,
  opts?: DummyOptions,
): DummyPage {
  const o = { ...DEFAULT_OPTIONS, ...(opts ?? {}) };
  return fetchDummyOlder(o.total, limit, o);
}

export function fetchDummyOlder(
  before: number,
  limit: number,
  opts?: DummyOptions,
): DummyPage {
  const o = { ...DEFAULT_OPTIONS, ...(opts ?? {}) };
  const total = o.total;

  const safeBefore = Math.max(0, Math.min(before, total));
  const start = Math.max(0, safeBefore - Math.max(0, limit));
  const end = safeBefore;

  const items: ChartPoint[] = [];
  for (let i = start; i < end; i++) {
    items.push(makeDummyPointByIndex(i, o));
  }

  return {
    items, // 時刻は昇順（古→新）
    nextBefore: start,
    hasMore: start > 0,
  };
}

/**
 * 既存のチャート実装（PADを使う）に合わせたいときのヘルパー
 */
export function withPads(items: ChartPoint[]): ChartPoint[] {
  return [
    { time: PAD_START, value: null, isPad: true },
    ...items,
    { time: PAD_END, value: null, isPad: true },
  ];
}
