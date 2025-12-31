'use client';

import type { ReactNode } from 'react';
import type { MyProfileResponse } from '@/lib/me/useMeProfileOptions';
import {
  useMeProfileBar,
  type MeProfileBarApi,
} from '@/components/me/useMeProfileBar';

export default function MeProfileView({
  base,
  children,
}: {
  base?: MyProfileResponse;
  children: (api: MeProfileBarApi) => ReactNode;
}) {
  const api = useMeProfileBar({
    base,
  });

  return <>{children(api)}</>;
}
