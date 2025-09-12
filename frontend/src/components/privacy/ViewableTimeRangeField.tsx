"use client";

import { useMemo } from "react";
import { Clock, Sun, SunMedium, Moon, RotateCcw, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type TimeRange = { start: string; end: string };

type Props = {
  value?: TimeRange;
  onChange: (next?: TimeRange) => void;
  /** 23:00 → 06:00 のような “翌日またぎ” を許可する場合 true */
  allowOvernight?: boolean;
};

const MINUTES_IN_DAY = 24 * 60;

const pad2 = (n: number) => n.toString().padStart(2, "0");
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function diffMinutes(start: string, end: string, allowOvernight: boolean) {
  let d = toMin(end) - toMin(start);
  if (allowOvernight && d <= 0) d += MINUTES_IN_DAY;
  return d;
}

function fmtDuration(mins: number) {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

export default function ViewableTimeRangeField({ value, onChange, allowOvernight = false }: Props) {
  const times = useMemo(
    () =>
      Array.from({ length: (24 * 60) / 15 }, (_, i) => {
        const t = i * 15;
        const hh = pad2(Math.floor(t / 60));
        const mm = pad2(t % 60);
        return `${hh}:${mm}`;
      }),
    []
  );

  const start = value?.start ?? "";
  const end = value?.end ?? "";
  const hasBoth = start && end;

  const minutes = hasBoth ? diffMinutes(start, end, allowOvernight) : 0;
  const invalid =
    (start && !times.includes(start)) ||
    (end && !times.includes(end)) ||
    (hasBoth && !allowOvernight && toMin(end) <= toMin(start));

  const setStart = (s?: string) =>
    onChange(
      s
        ? { start: s, end: value?.end ?? "" }
        : value?.end
        ? { start: "", end: value.end }
        : undefined
    );
  const setEnd = (e?: string) =>
    onChange(
      e
        ? { start: value?.start ?? "", end: e }
        : value?.start
        ? { start: value.start, end: "" }
        : undefined
    );

  const applyPreset = (s: string, e: string) => onChange({ start: s, end: e });

  const clearAll = () => onChange(undefined);

  const activePreset =
    hasBoth && start === "00:00" && end === "23:59"
      ? "all"
      : hasBoth && start === "06:00" && end === "12:00"
      ? "morning"
      : hasBoth && start === "09:00" && end === "18:00"
      ? "day"
      : hasBoth && start === "18:00" && end === "23:00"
      ? "night"
      : undefined;

  return (
    <Card className="border-muted/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <CardTitle className="text-base">閲覧可能時間帯</CardTitle>
          {hasBoth ? (
            <Badge variant="secondary" className="ml-auto">
              {start} – {end}
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto">未設定</Badge>
          )}
        </div>
        <CardDescription className="mt-1">毎日の中で、閲覧を許可する時間帯を指定します（15分刻み）。</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* プリセット */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs text-muted-foreground">プリセット</Label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={activePreset === "all" ? "default" : "secondary"} onClick={() => applyPreset("00:00", "23:59")}> 
              <SunMedium className="mr-1 h-4 w-4" />
              終日
            </Button>
            <Button size="sm" variant={activePreset === "morning" ? "default" : "secondary"} onClick={() => applyPreset("06:00", "12:00")}> 
              <Sun className="mr-1 h-4 w-4" />
              朝（6–12）
            </Button>
            <Button size="sm" variant={activePreset === "day" ? "default" : "secondary"} onClick={() => applyPreset("09:00", "18:00")}> 
              <SunMedium className="mr-1 h-4 w-4" />
              日中（9–18）
            </Button>
            <Button size="sm" variant={activePreset === "night" ? "default" : "secondary"} onClick={() => applyPreset("18:00", "23:00")}> 
              <Moon className="mr-1 h-4 w-4" />
              夜（18–23）
            </Button>
            <Button size="sm" variant="ghost" onClick={clearAll}>
              <X className="mr-1 h-4 w-4" />
              クリア
            </Button>
          </div>
        </div>

        {/* 選択UI（開始～終了） */}
        <div className={["grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl border p-2", invalid ? "ring-1 ring-destructive/60" : ""].join(" ")}> 
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">開始</Label>
            <Select value={start} onValueChange={(v) => setStart(v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="--:--" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {times.map((t) => (
                  <SelectItem key={t} value={t} className="text-sm">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="px-1 text-sm opacity-60">—</div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">終了</Label>
            <Select value={end} onValueChange={(v) => setEnd(v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="--:--" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {times.map((t) => (
                  <SelectItem key={t} value={t} className="text-sm">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* オプション & ステータス */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Switch id="overnight" checked={allowOvernight} onCheckedChange={() => {}} disabled />
            <Label htmlFor="overnight" className="text-sm text-muted-foreground">翌日またぎを許可</Label>
          </div>

          <div className="flex items-center gap-3">
            {invalid ? (
              <span className="text-sm text-destructive">終了は開始より後の時刻にしてください</span>
            ) : hasBoth ? (
              <span className="text-sm text-muted-foreground">合計 <strong className="font-medium">{fmtDuration(minutes)}</strong></span>
            ) : (
              <span className="text-sm text-muted-foreground">時間帯が未設定です</span>
            )}
            <Button size="sm" variant="outline" onClick={() => onChange(value)}>
              <RotateCcw className="mr-1 h-4 w-4" />
              変更を保持
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
