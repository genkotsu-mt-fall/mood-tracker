'use client';

import { useMemo } from 'react';
import type { MeProfileBarProps } from './MeProfileBar';
import { MyProfileResponse } from '@genkotsu-mt-fall/shared/schemas';

export type MeProfileBarApi = {
  barProps: MeProfileBarProps;
};

export function useMeProfileBar({
  base,
}: {
  base?: MyProfileResponse;
}): MeProfileBarApi {
  const barProps = useMemo<MeProfileBarProps>(() => {
    const u = base?.profile;

    // 名前が無い場合はメールにフォールバック（「自分のページ」前提でUXを崩さない）
    const displayName = u?.name?.trim()
      ? u.name
      : (u?.email ?? '（名前未設定）');
    const subtitle = u?.name?.trim() ? u.email : undefined;

    return {
      name: displayName,
      subtitle,
      followersCount: base?.followersCount,
      followingCount: base?.followingCount,
    };
  }, [base]);

  return { barProps };
}
