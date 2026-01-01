'use client';

import PrivacyEditor from '@/components/privacy/PrivacyEditor';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import type { PrivacySetting } from '@/lib/privacy/types';
import type { Option } from '@/lib/common/types';

type Props = {
  value: PrivacySetting | undefined;
  onChange: (v: PrivacySetting | undefined) => void;
  userOptions: Option[];
  // PrivacyEditor が Promise を要求するので合わせる
  onRequestCreateGroup?: () => Promise<Option | void>;
};

export default function ComposePrivacyCard({
  value,
  onChange,
  userOptions,
  onRequestCreateGroup,
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px]">
      <Card className="rounded-3xl border border-gray-200/80 bg-white/80">
        <CardHeader className="pb-2">
          <Label className="text-xs text-gray-500">可視性 (privacyJson)</Label>
        </CardHeader>
        <CardContent className="pt-0">
          <PrivacyEditor
            value={value}
            onChange={onChange}
            userOptions={userOptions}
            onRequestCreateGroup={onRequestCreateGroup}
          />
        </CardContent>
      </Card>
    </div>
  );
}
