'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type Props = {
  intensity: number | undefined;
  onChange: (v: number | undefined) => void;
  error?: string;
};

function clamp01to100(n: number) {
  return Math.min(100, Math.max(0, n));
}

export default function ComposeIntensityCard({
  intensity,
  onChange,
  error,
}: Props) {
  const meterWidth = intensity == null ? '0%' : `${clamp01to100(intensity)}%`;

  return (
    <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px] h-full">
      <Card className="h-full rounded-3xl border border-gray-200/80 bg-white/80 flex flex-col">
        <CardHeader className="pb-2">
          <Label className="text-xs text-gray-500">浮き沈み（%）</Label>
        </CardHeader>

        <CardContent className="pt-1 space-y-3 grow">
          <div className="flex items-center gap-3">
            <Slider
              value={intensity == null ? undefined : [intensity]}
              max={100}
              step={1}
              onValueChange={(v) => onChange(v[0])}
              className="flex-1"
            />

            <input
              type="number"
              name={intensity == null ? undefined : 'intensity'}
              min={0}
              max={100}
              value={intensity ?? ''}
              placeholder="未設定"
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') return onChange(undefined);
                const n = Number(raw);
                if (Number.isNaN(n)) return onChange(undefined);
                onChange(clamp01to100(n));
              }}
              className="w-20 rounded-xl border bg-white/80 px-2 py-1 text-sm text-right"
            />

            {!!error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-400 transition-[width]"
              style={{ width: meterWidth }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-gray-400">
            <span>不安定</span>
            <span>安定</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
