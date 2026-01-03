'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import {
  users,
  fetchDummyLatest,
  fetchDummyOlder,
} from './GlassMoodChart.dummy';
import {
  PAD_START,
  PAD_END,
  ChartPoint,
  FilterTag,
  FILTER_TAGS,
} from './GlassMoodChart.model';

/**
 * 無限パン設計パラメータ
 * - VISIBLE: チャートに表示する点数（常に10件）
 * - STOCK_TARGET: 初回/追加取得で「だいたいこのくらい先読みを確保したい」目安（50件）
 * - THRESHOLD: 古い側の残り（左側の残り）がこの数以下になったら追加取得（20件）
 */
const VISIBLE = 10;
const STOCK_TARGET = 50;
const THRESHOLD = 20;

/**
 * ドラッグ→インデックス変換の “感度”
 * 1点分を何pxとして扱うか（大きいほど、同じドラッグ量でも動きが遅くなる）
 */
const POINT_PX = 28;

/**
 * 「クリック」か「ドラッグ」かを判定する閾値（px）
 * - これより動いたら “パン” とみなしてクリック処理（点の追加）をしない
 */
const DRAG_THRESHOLD_PX = 6;

/** any 回避：最小型だけ定義 */
type RechartsDotProps<TPayload = unknown> = {
  cx?: number;
  cy?: number;
  value?: number | null;
  payload?: TPayload;
};

type RechartsLabelProps<TPayload = unknown> = {
  x?: number;
  y?: number;
  value?: number | null;
  payload?: TPayload;
};

// Recharts の onMouseDown 型をそのまま使う（型ズレ対策）
type ComposedChartMouseDown = NonNullable<
  React.ComponentProps<typeof ComposedChart>['onMouseDown']
>;
type MouseDownState = Parameters<ComposedChartMouseDown>[0];
type MouseDownEvent = Parameters<ComposedChartMouseDown>[1];

// activeTooltipIndex は null を取り得るので unknown で受けて安全に変換
function parseActiveIndex(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// MouseEvent からチャート内座標（CSS transform scale 考慮）を計算
function getChartPointerFromMouseEvent(
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

function getClientXFromMouseDownEvent(
  e: MouseDownEvent | undefined,
): number | null {
  if (!e) return null;
  const evt = e as unknown as { clientX?: number };
  return typeof evt.clientX === 'number' ? evt.clientX : null;
}

function isEventFromDot(e: MouseDownEvent | undefined): boolean {
  if (!e) return false;
  const target = (e as unknown as { target?: Element | null }).target ?? null;
  if (!target?.closest) return false;
  return !!target.closest('[data-gmc-dot="1"]');
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * "yyyy/MM/dd HH:mm" を安全に parse（環境依存の Date.parse を避ける）
 */
function parseTimeToMs(s: string): number | null {
  if (!s || s === PAD_START || s === PAD_END) return null;
  // 例: 2026/01/02 09:00
  const [d, t] = s.split(' ');
  if (!d || !t) return null;
  const [yyyy, mm, dd] = d.split('/').map((x) => Number.parseInt(x, 10));
  const [HH, MM] = t.split(':').map((x) => Number.parseInt(x, 10));
  if (![yyyy, mm, dd, HH, MM].every((n) => Number.isFinite(n))) return null;

  // month は 0-based
  const dt = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, HH ?? 0, MM ?? 0, 0, 0);
  const ms = dt.getTime();
  return Number.isFinite(ms) ? ms : null;
}

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

function roundToMinute(ms: number) {
  const m = 60_000;
  return Math.round(ms / m) * m;
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags)).filter(Boolean);
}

type PointClickHandler = (
  p: ChartPoint,
  anchor: { x: number; y: number },
) => void;

function GlowDot({
  cx,
  cy,
  value,
  payload,
  onPointClick,
}: RechartsDotProps<ChartPoint> & { onPointClick?: PointClickHandler }) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (!payload || payload.isPad) return null;

  const rOuter = clamp(10 + value * 0.02, 10, 12);

  return (
    <g
      data-gmc-dot="1"
      style={{ cursor: 'pointer' }}
      onClick={(ev) => {
        ev.stopPropagation();
        onPointClick?.(payload, { x: cx, y: cy });
      }}
    >
      <circle cx={cx} cy={cy} r={rOuter} fill="rgba(56,189,248,0.18)" />
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(56,189,248,0.80)"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={4} fill="rgba(255,255,255,1)" />
    </g>
  );
}

function GlowActiveDot({
  cx,
  cy,
  value,
  payload,
  onPointClick,
}: RechartsDotProps<ChartPoint> & { onPointClick?: PointClickHandler }) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (!payload || payload.isPad) return null;

  return (
    <g
      data-gmc-dot="1"
      style={{ cursor: 'pointer' }}
      onClick={(ev) => {
        ev.stopPropagation();
        onPointClick?.(payload, { x: cx, y: cy });
      }}
    >
      <circle cx={cx} cy={cy} r={16} fill="rgba(56,189,248,0.22)" />
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill="rgba(255,255,255,0.96)"
        stroke="rgba(34,211,238,0.92)"
        strokeWidth={3}
      />
      <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,1)" />
    </g>
  );
}

type PillLabelExtraProps = {
  filterId: string;
};

function PillLabel(
  props: RechartsLabelProps<ChartPoint> & PillLabelExtraProps,
) {
  const { x, y, value, payload, filterId } = props;
  if (typeof x !== 'number' || typeof y !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (payload?.isPad) return null;

  const v = Math.round(value);
  const emoji = typeof payload?.emoji === 'string' ? payload.emoji : '🙂';
  const text = `${v}%`;

  const w = v >= 100 ? 90 : v >= 10 ? 82 : 76;
  const h = 36;

  const tx = x - w / 2;
  const ty = y - h - 14;

  return (
    <g transform={`translate(${tx},${ty})`} pointerEvents="none">
      <rect
        width={w}
        height={h}
        rx={18}
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.22)"
        filter={`url(#${filterId})`}
      />
      <circle
        cx={18}
        cy={h / 2}
        r={12}
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.22)"
      />
      <text x={18} y={h / 2 + 5} textAnchor="middle" fontSize={14}>
        {emoji}
      </text>

      <text
        x={w - 14}
        y={h / 2 + 5}
        textAnchor="end"
        fontSize={14}
        fontWeight={800}
        fill="rgba(255,255,255,0.92)"
        paintOrder="stroke"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={3}
      >
        {text}
      </text>
    </g>
  );
}

function UserMiniCard({ p }: { p: ChartPoint }) {
  const user = p.user;
  const v = typeof p.value === 'number' ? Math.round(p.value) : null;
  const emoji = typeof p.emoji === 'string' ? p.emoji : '🙂';
  if (!user || v === null) return null;

  return (
    <button
      type="button"
      className="
        snap-start shrink-0
        w-[260px] rounded-2xl
        border border-white/15
        bg-white/10
        backdrop-blur-md
        shadow-[0_12px_28px_rgba(0,0,0,0.28)]
        px-3 py-2
        text-left
        hover:bg-white/12
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-full
            border border-white/15
            bg-white/12
            backdrop-blur-md
            flex items-center justify-center
            text-white/90 font-semibold
          "
          aria-hidden="true"
        >
          {user.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/92">
                {user.name}
              </div>
              <div className="truncate text-xs text-white/65">
                {user.handle}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <div className="text-lg">{emoji}</div>
              <div className="text-sm font-extrabold text-white/92">{v}%</div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5">
              {p.time.slice(11)}
            </span>
            {Array.isArray(p.tags) && p.tags.length > 0 ? (
              <span className="truncate rounded-full border border-white/10 bg-white/8 px-2 py-0.5">
                {p.tags.join(' · ')}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

type EditPopoverState = {
  time: string; // 対象ポイントの time（draft でも既存でも）
  anchor: { x: number; y: number }; // 表示座標（チャート内）
};

type ClickSeed = {
  pointerX: number;
  activeIdx: number;
  activeX: number;
  anchorY: number;
};

type DragSession = {
  startClientX: number;
  startWindowStart: number;
  isDragging: boolean;
  clickSeed?: ClickSeed;
};

function getClientXFromWindowEvent(ev: MouseEvent | TouchEvent): number | null {
  if ('touches' in ev) {
    const t = ev.touches?.[0] ?? ev.changedTouches?.[0];
    return typeof t?.clientX === 'number' ? t.clientX : null;
  }
  return typeof (ev as MouseEvent).clientX === 'number'
    ? (ev as MouseEvent).clientX
    : null;
}

export default function GlassMoodChart() {
  const uid = useId().replace(/:/g, '');
  const strokeGradId = `strokeGrad-${uid}`;
  const pillShadowId = `pillShadow-${uid}`;

  const padStartPoint = useMemo<ChartPoint>(
    () => ({ time: PAD_START, value: null, isPad: true }),
    [],
  );
  const padEndPoint = useMemo<ChartPoint>(
    () => ({ time: PAD_END, value: null, isPad: true }),
    [],
  );

  const [selectedTag, setSelectedTag] = useState<FilterTag>('All');

  /**
   * points は「ロード済みの全データ（PAD含む）」を保持する
   * - 無限パンのため、ここは増えていく
   * - draft もここに混在する
   */
  const [points, setPoints] = useState<ChartPoint[]>([
    padStartPoint,
    padEndPoint,
  ]);

  /**
   * windowStart は「ロード済みデータ（PAD除外）の中で、今表示している窓の開始位置」
   * - 表示は常に 10件（VISIBLE）
   */
  const [windowStart, setWindowStart] = useState(0);

  // 編集ポップオーバー（draft/既存共通）
  const [editPopover, setEditPopover] = useState<EditPopoverState | null>(null);

  // チャート領域（オーバーレイ配置の基準）
  const chartWrapRef = useRef<HTMLDivElement | null>(null);

  /**
   * 無限ロード用の “擬似DBカーソル”
   * - beforeIndex: 「この index より古いものをください」の境界（exclusive）
   */
  const beforeIndexRef = useRef<number | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const fetchingRef = useRef<boolean>(false);

  /**
   * パン（ドラッグ）セッション
   */
  const dragRef = useRef<DragSession | null>(null);
  const panningRef = useRef<boolean>(false);

  /**
   * 1) 初回ロード：最新50件を取得し、そのうち最新10件を表示
   */
  useEffect(() => {
    const page = fetchDummyLatest(STOCK_TARGET);
    // items は「古い→新しい」想定
    const core = page.items;

    beforeIndexRef.current = page.nextBefore;
    hasMoreRef.current = page.hasMore;

    setPoints([padStartPoint, ...core, padEndPoint]);

    // 最新10件 = 末尾10件なので windowStart は (core.length - VISIBLE)
    const start = Math.max(0, core.length - VISIBLE);
    setWindowStart(start);
  }, [padStartPoint, padEndPoint]);

  /**
   * PADを除いたロード済みデータ（draftも含む）
   */
  const corePoints = useMemo(() => points.filter((p) => !p.isPad), [points]);

  /**
   * windowStart の範囲（0..maxStart）を保つための最大値
   */
  const maxWindowStart = useMemo(() => {
    return Math.max(0, corePoints.length - VISIBLE);
  }, [corePoints.length]);

  /**
   * 表示窓（PAD付き）
   * - チャートに渡すデータは「常に10件+PAD」なので描画が軽い
   */
  const windowedPoints = useMemo(() => {
    const safeStart = clamp(windowStart, 0, maxWindowStart);
    const slice = corePoints.slice(safeStart, safeStart + VISIBLE);
    return [padStartPoint, ...slice, padEndPoint];
  }, [corePoints, windowStart, maxWindowStart, padStartPoint, padEndPoint]);

  /**
   * タグフィルタ：選択外は value:null にして点/ラベルを消し、線も切る
   * ※ここは “表示窓” に対して適用する（全件に適用しない）
   */
  const filteredData = useMemo(() => {
    if (selectedTag === 'All') return windowedPoints;

    return windowedPoints.map((p) => {
      if (p.isPad) return p;
      const hit = (p.tags ?? []).includes(selectedTag);
      if (hit) return p;
      return { ...p, value: null };
    });
  }, [windowedPoints, selectedTag]);

  /**
   * スライダー用（Pad除外 + valueがあるものだけ / draft は除外）
   * ※ここも “表示窓” に合わせる（チャートと同期）
   */
  const sliderItems = useMemo(() => {
    return filteredData.filter(
      (p) => !p.isPad && !p.isDraft && typeof p.value === 'number' && p.user,
    );
  }, [filteredData]);

  /**
   * 2) 無限ロード：古い側（左側）の残りが THRESHOLD 以下になったら追加取得
   *
   * - leftRemaining = windowStart
   *   （表示窓の左側に “まだ読み込み済みのデータが何件残っているか”）
   *
   * 例）
   *   core=50件, VISIBLE=10
   *   windowStart=40 → 最新10件
   *   windowStart=30 → 10件分古い
   *   windowStart=20 → 左側残り20 → ここで追加取得
   */
  useEffect(() => {
    // ドラッグ中は “表示が落ち着いてから” 取得する（ズレやジャンプを避ける）
    if (panningRef.current) return;

    if (!hasMoreRef.current) return;
    if (fetchingRef.current) return;

    const leftRemaining = windowStart;
    if (leftRemaining > THRESHOLD) return;

    const before = beforeIndexRef.current;
    if (before == null || before <= 0) {
      hasMoreRef.current = false;
      return;
    }

    // 左側残りを STOCK_TARGET に戻すイメージ
    // 例：leftRemaining=20 のとき need=30
    const need = Math.max(0, STOCK_TARGET - leftRemaining);
    if (need === 0) return;

    fetchingRef.current = true;
    try {
      const page = fetchDummyOlder(before, need);

      beforeIndexRef.current = page.nextBefore;
      hasMoreRef.current = page.hasMore;

      const olderItems = page.items; // 古い→新しい
      const addCount = olderItems.length;

      if (addCount > 0) {
        // 既存の core の前に prepend（古いものは左へ増える）
        setPoints((prev) => {
          const prevCore = prev.filter((p) => !p.isPad);
          return [padStartPoint, ...olderItems, ...prevCore, padEndPoint];
        });

        // prepend した分、windowStart を右にずらして “見えていた区間” を維持する
        setWindowStart((s) => s + addCount);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [windowStart, padStartPoint, padEndPoint]);

  function findPointByTime(time: string): ChartPoint | undefined {
    return points.find((p) => !p.isPad && p.time === time);
  }

  function updatePointByTime(time: string, patch: Partial<ChartPoint>) {
    setPoints((prev) =>
      prev.map((p) => {
        if (p.isPad) return p;
        if (p.time !== time) return p;
        return { ...p, ...patch };
      }),
    );
  }

  function insertDraftPoint(draft: ChartPoint) {
    setPoints((prev) => {
      const cleaned = prev.filter((p) => !p.isDraft);

      // 既に同時刻があるなら insert しない（編集に切り替える）
      const exists = cleaned.some((p) => !p.isPad && p.time === draft.time);
      if (exists) return cleaned;

      const draftMs = parseTimeToMs(draft.time);
      if (draftMs == null) return cleaned;

      // PAD_END の直前に入るよう、時刻でソート位置を決定
      const insertAt = (() => {
        for (let i = 0; i < cleaned.length; i++) {
          const p = cleaned[i];
          if (p.isPad) continue;
          const ms = parseTimeToMs(p.time);
          if (ms == null) continue;
          if (ms > draftMs) return i;
        }
        // 見つからなければ PAD_END の直前
        return Math.max(0, cleaned.length - 1);
      })();

      return [...cleaned.slice(0, insertAt), draft, ...cleaned.slice(insertAt)];
    });
  }

  function findValidIndexLeft(arr: ChartPoint[], start: number): number | null {
    for (let i = start; i >= 0; i--) {
      const p = arr[i];
      if (!p) continue;
      if (p.isPad) continue;
      if (typeof p.value !== 'number') continue;
      return i;
    }
    return null;
  }

  function findValidIndexRight(
    arr: ChartPoint[],
    start: number,
  ): number | null {
    for (let i = start; i < arr.length; i++) {
      const p = arr[i];
      if (!p) continue;
      if (p.isPad) continue;
      if (typeof p.value !== 'number') continue;
      return i;
    }
    return null;
  }

  /**
   * クリック（＝ドラッグでなかった場合）にだけ実行する、既存の「中間点を作る」ロジック
   */
  function tryInsertByClick(seed: ClickSeed) {
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
      setEditPopover({ time: midTime, anchor });
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

    insertDraftPoint(draft);
    setEditPopover({ time: midTime, anchor });
  }

  /**
   * パン（ドラッグ）実装：
   * - onMouseDown で「クリック候補 or ドラッグ候補」を開始
   * - window の mousemove で一定以上動いたらパンとして windowStart を更新
   * - window の mouseup で終了（ドラッグだったらスナップ、クリックだったら点追加）
   */
  const attachWindowDragListeners = () => {
    window.addEventListener('mousemove', onWindowMove, true);
    window.addEventListener('mouseup', onWindowUp, true);
    window.addEventListener(
      'touchmove',
      onWindowMove as unknown as EventListener,
      {
        capture: true,
        passive: false,
      },
    );
    window.addEventListener(
      'touchend',
      onWindowUp as unknown as EventListener,
      true,
    );
  };

  const detachWindowDragListeners = () => {
    window.removeEventListener('mousemove', onWindowMove, true);
    window.removeEventListener('mouseup', onWindowUp, true);
    window.removeEventListener(
      'touchmove',
      onWindowMove as unknown as EventListener,
      true,
    );
    window.removeEventListener(
      'touchend',
      onWindowUp as unknown as EventListener,
      true,
    );
  };

  const onWindowMove = (ev: MouseEvent | TouchEvent) => {
    const session = dragRef.current;
    if (!session) return;

    // touch の場合、スクロール抑止
    if ('touches' in ev) {
      ev.preventDefault();
    }

    const cx = getClientXFromWindowEvent(ev);
    if (!isFiniteNumber(cx)) return;

    const deltaX = cx - session.startClientX;

    // まだドラッグ確定していないなら、一定以上動いた時点でドラッグ扱いにする
    if (!session.isDragging) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
      session.isDragging = true;
      panningRef.current = true;
      // パン開始したら編集UIは閉じる
      setEditPopover(null);
    }

    // ドラッグ量(px) → index差分
    // 「左へドラッグ（deltaX<0）で windowStart を減らす」＝古い方へ移動
    const deltaIndex = Math.round(deltaX / POINT_PX);

    const next = clamp(
      session.startWindowStart + deltaIndex,
      0,
      maxWindowStart,
    );

    // 無駄な再描画を避ける
    setWindowStart((prev) => (prev === next ? prev : next));
  };

  const onWindowUp = () => {
    const session = dragRef.current;
    dragRef.current = null;
    panningRef.current = false;
    detachWindowDragListeners();

    if (!session) return;

    if (session.isDragging) {
      // パン終了：10件単位にスナップ（0-10, 10-20, ... を再現）
      setWindowStart((s) => {
        const snapped = Math.round(s / VISIBLE) * VISIBLE;
        return clamp(snapped, 0, maxWindowStart);
      });
      return;
    }

    // ドラッグでなかった＝クリック：中間点追加ロジック
    if (session.clickSeed) {
      tryInsertByClick(session.clickSeed);
    }
  };

  const handlePointClick: PointClickHandler = (p, anchor) => {
    // 念のため（PADは来ない想定）
    if (p.isPad) return;

    // その時刻の点を編集対象にする
    setEditPopover({ time: p.time, anchor });
  };

  const handleChartMouseDown: ComposedChartMouseDown = (s, e) => {
    const clientX = getClientXFromMouseDownEvent(e);
    if (!isFiniteNumber(clientX)) return;

    // ★追加：ドット上なら “中間点作成の種” を作らない
    const fromDot = isEventFromDot(e);

    const ptr = getChartPointerFromMouseEvent(e);
    const pointerX = ptr?.x;

    const activeIdx = parseActiveIndex(
      (s as MouseDownState).activeTooltipIndex,
    );
    const activeX = (s as MouseDownState).activeCoordinate?.x;
    const activeY = (s as MouseDownState).activeCoordinate?.y;

    let clickSeed: ClickSeed | undefined = undefined;

    // ★変更：ドット上クリックの場合は clickSeed を作らない
    if (
      !fromDot &&
      isFiniteNumber(pointerX) &&
      activeIdx != null &&
      isFiniteNumber(activeX)
    ) {
      const anchorY = isFiniteNumber(activeY) ? activeY : (ptr?.y ?? NaN);
      if (isFiniteNumber(anchorY)) {
        clickSeed = { pointerX, activeIdx, activeX, anchorY };
      }
    }

    dragRef.current = {
      startClientX: clientX,
      startWindowStart: windowStart,
      isDragging: false,
      clickSeed,
    };

    attachWindowDragListeners();
  };

  const editPoint = editPopover ? findPointByTime(editPopover.time) : undefined;
  const isEditingDraft = !!editPoint?.isDraft;

  function closeEditor() {
    setEditPopover(null);
  }

  function cancelEditor() {
    if (isEditingDraft) {
      // draft はキャンセルで消す
      setPoints((prev) => prev.filter((p) => p.time !== editPopover?.time));
    }
    closeEditor();
  }

  function saveEditor() {
    if (!editPopover) return;
    // draft を確定（isDraftを外す）
    const t = editPopover.time;
    setPoints((prev) =>
      prev.map((p) => {
        if (p.isPad) return p;
        if (p.time !== t) return p;
        if (!p.isDraft) return p;
        return { ...p, isDraft: false };
      }),
    );
    closeEditor();
  }

  // オーバーレイ位置：chartWrapRef を基準に absolute
  const popoverStyle = useMemo((): React.CSSProperties | undefined => {
    if (!editPopover) return undefined;
    const x = editPopover.anchor.x;
    const y = editPopover.anchor.y;
    return {
      left: x + 14,
      top: Math.max(8, y - 110),
    };
  }, [editPopover]);

  return (
    <div className="h-full w-full">
      <div
        className="
          h-full overflow-hidden rounded-3xl
          border border-white/15
          bg-white/10
          backdrop-blur-lg
          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
        "
      >
        <div className="h-full min-h-0 min-w-0 px-3 pb-6 pt-4 flex flex-col gap-3">
          {/* Filter tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {FILTER_TAGS.map((t) => {
              const active = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={[
                    'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                    'border backdrop-blur-md',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40',
                    active
                      ? 'bg-white/20 border-white/25 text-white'
                      : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/14',
                  ].join(' ')}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <div
              ref={chartWrapRef}
              className="relative h-full cursor-grab active:cursor-grabbing"
            >
              {/* Editor popover */}
              {editPopover && editPoint ? (
                <div
                  className="
                    absolute z-20
                    w-[260px]
                    rounded-2xl
                    border border-white/18
                    bg-white/12
                    backdrop-blur-lg
                    shadow-[0_18px_50px_rgba(0,0,0,0.40)]
                    p-3
                  "
                  style={popoverStyle}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white/85">
                        {isEditingDraft ? 'New point' : 'Edit point'}
                      </div>
                      <div className="mt-0.5 text-xs text-white/60">
                        {editPoint.time}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={cancelEditor}
                      className="
                        shrink-0
                        rounded-full
                        border border-white/15 bg-white/10
                        px-2 py-1 text-xs font-semibold text-white/80
                        hover:bg-white/14
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
                      "
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <label className="grid gap-1">
                      <span className="text-[11px] font-semibold text-white/70">
                        Emoji
                      </span>
                      <input
                        value={editPoint.emoji ?? ''}
                        onChange={(e) =>
                          updatePointByTime(editPoint.time, {
                            emoji: e.target.value,
                          })
                        }
                        className="
                          h-9 w-full rounded-xl
                          border border-white/15 bg-white/10
                          px-3 text-sm text-white/90
                          outline-none
                          focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/20
                        "
                        inputMode="text"
                        placeholder="🙂"
                      />
                    </label>

                    <label className="grid gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white/70">
                          Value
                        </span>
                        <span className="text-[11px] font-extrabold text-white/90">
                          {typeof editPoint.value === 'number'
                            ? Math.round(editPoint.value)
                            : '--'}
                          %
                        </span>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={
                          typeof editPoint.value === 'number'
                            ? Math.round(editPoint.value)
                            : 50
                        }
                        onChange={(e) => {
                          const n = Number.parseInt(e.target.value, 10);
                          updatePointByTime(editPoint.time, {
                            value: clamp(n, 0, 100),
                          });
                        }}
                        className="w-full"
                      />
                    </label>

                    {Array.isArray(editPoint.tags) &&
                    editPoint.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {editPoint.tags.slice(0, 3).map((tg) => (
                          <span
                            key={tg}
                            className="rounded-full border border-white/12 bg-white/8 px-2 py-0.5 text-[11px] text-white/70"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelEditor}
                        className="
                          flex-1 rounded-xl
                          border border-white/15 bg-white/10
                          px-3 py-2 text-xs font-semibold text-white/80
                          hover:bg-white/14
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
                        "
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEditor}
                        className="
                          flex-1 rounded-xl
                          border border-sky-300/25 bg-sky-300/15
                          px-3 py-2 text-xs font-extrabold text-white
                          hover:bg-sky-300/18
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
                        "
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 32, right: 18, left: 18, bottom: 8 }}
                  onMouseDown={handleChartMouseDown}
                >
                  <defs>
                    <linearGradient
                      id={strokeGradId}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="rgba(99,102,241,0.95)" />
                      <stop offset="55%" stopColor="rgba(56,189,248,0.95)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0.95)" />
                    </linearGradient>

                    <filter
                      id={pillShadowId}
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="6"
                        stdDeviation="6"
                        floodColor="rgba(0,0,0,0.28)"
                      />
                    </filter>
                  </defs>

                  {/* active* を得るため内部的に置く（非表示） */}
                  <Tooltip
                    cursor={false}
                    wrapperStyle={{ display: 'none' }}
                    content={() => null}
                  />

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tick={{ fill: 'rgba(226,232,240,0.78)', fontSize: 12 }}
                    tickFormatter={(v) => {
                      const s = String(v);
                      if (s === PAD_START || s === PAD_END) return '';
                      return s.length >= 16 ? s.slice(11) : s;
                    }}
                  />

                  <YAxis hide domain={[0, 100]} />

                  <Line
                    connectNulls={selectedTag === 'All'}
                    type="monotone"
                    dataKey="value"
                    stroke={`url(#${strokeGradId})`}
                    strokeWidth={4}
                    dot={<GlowDot onPointClick={handlePointClick} />}
                    activeDot={
                      <GlowActiveDot onPointClick={handlePointClick} />
                    }
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="value"
                      content={<PillLabel filterId={pillShadowId} />}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User cards slider */}
          <div className="shrink-0">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <div className="text-xs font-semibold text-white/80">
                Recent posts
              </div>
              <div className="text-xs text-white/50">
                {sliderItems.length} items
              </div>
            </div>

            <div
              className="
                mt-2
                flex gap-2
                overflow-x-auto no-scrollbar
                pb-2
                snap-x snap-mandatory
                [-webkit-overflow-scrolling:touch]
              "
            >
              {sliderItems.length === 0 ? (
                <div
                  className="
                    w-full rounded-2xl
                    border border-white/10 bg-white/8
                    px-3 py-3 text-sm text-white/70
                  "
                >
                  No items for this filter.
                </div>
              ) : (
                sliderItems.map((p) => (
                  <UserMiniCard key={`${p.time}-${p.user?.id ?? ''}`} p={p} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
