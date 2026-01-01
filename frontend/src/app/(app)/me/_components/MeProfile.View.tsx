'use client';

import type { ReactNode } from 'react';
import {
  useMeProfileBar,
  type MeProfileBarApi,
} from '@/components/me/useMeProfileBar';
import { MyProfileResponse } from '@genkotsu-mt-fall/shared/schemas';

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
