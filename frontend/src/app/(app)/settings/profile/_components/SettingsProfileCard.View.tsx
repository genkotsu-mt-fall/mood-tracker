'use client';

import type { KeyedMutator } from 'swr';

import SettingsProfileCard from '@/components/settings/SettingsProfileCard';
import { useSettingsProfileCard } from '@/lib/me/useSettingsProfileCard';
import { MyProfileResponse } from '@genkotsu-mt-fall/shared/schemas';

export default function SettingsProfileCardView({
  data,
  mutate,
}: {
  data?: MyProfileResponse;
  mutate: KeyedMutator<MyProfileResponse>;
}) {
  const api = useSettingsProfileCard({ data, mutate });

  return (
    <SettingsProfileCard {...api} bio="自己紹介は後で対応（DBカラム未追加)" />
  );
}
