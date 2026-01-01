'use client';

import { Shield } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  crisisFlag: boolean;
  onChange: (v: boolean) => void;
};

export default function ComposeSensitiveToggle({
  crisisFlag,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 backdrop-blur">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="crisisFlag"
          className="h-4 w-4"
          checked={crisisFlag}
          onChange={(e) => onChange(e.target.checked)}
        />
        センシティブ
      </label>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex select-none items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs text-gray-600">
            <Shield className="h-3.5 w-3.5" />
            <span>{crisisFlag ? 'ON' : 'OFF'}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>不適切な内容を含む可能性があるときに ON</TooltipContent>
      </Tooltip>
    </div>
  );
}
