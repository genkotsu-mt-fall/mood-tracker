'use client';

import { useId } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Users, UserCheck } from 'lucide-react';

export type Audience = 'public' | 'followers' | 'mutuals';

type Props = {
  value: Audience;
  onChange: (next: Audience) => void;
  className?: string;
};

export default function AudienceScopeSelector({
  value,
  onChange,
  className,
}: Props) {
  const uid = useId();
  const audPublicId = `${uid}-aud-public`;
  const audFollowersId = `${uid}-aud-followers`;
  const audMutualsId = `${uid}-aud-mutuals`;

  const rootClass =
    'grid grid-cols-1 sm:grid-cols-3 gap-3' +
    (className ? ` ${className}` : '');

  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as Audience)}
      className={rootClass}
    >
      {/* 全体 */}
      <label htmlFor={audPublicId} className="cursor-pointer">
        <RadioGroupItem
          id={audPublicId}
          value="public"
          className="sr-only peer"
        />
        <div className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30">
          <Globe className="h-4 w-4 mt-0.5 opacity-80" />
          <div>
            <div className="font-medium">全体</div>
            <div className="text-xs text-muted-foreground">誰でも閲覧可</div>
          </div>
        </div>
      </label>

      {/* フォロワー */}
      <label htmlFor={audFollowersId} className="cursor-pointer">
        <RadioGroupItem
          id={audFollowersId}
          value="followers"
          className="sr-only peer"
        />
        <div className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30">
          <Users className="h-4 w-4 mt-0.5 opacity-80" />
          <div>
            <div className="font-medium">フォロワーのみ</div>
            <div className="text-xs text-muted-foreground">
              あなたをフォローしている人だけ
            </div>
          </div>
        </div>
      </label>

      {/* 相互 */}
      <label htmlFor={audMutualsId} className="cursor-pointer">
        <RadioGroupItem
          id={audMutualsId}
          value="mutuals"
          className="sr-only peer"
        />
        <div className="flex items-start gap-2 rounded-xl border p-3 text-sm transition-all hover:shadow-sm peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/30">
          <UserCheck className="h-4 w-4 mt-0.5 opacity-80" />
          <div>
            <div className="font-medium">相互フォローのみ</div>
            <div className="text-xs text-muted-foreground">
              お互いにフォローしている関係
            </div>
          </div>
        </div>
      </label>
    </RadioGroup>
  );
}
