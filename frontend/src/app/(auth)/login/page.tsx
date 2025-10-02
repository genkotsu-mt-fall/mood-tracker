'use server';

import { redirect } from 'next/navigation';
import ClientLoginForm from './ClientLoginForm';
// import { setSignedReturnToCookie } from '@/lib/auth/returnToCookie';

// export const runtime = 'nodejs'; // node:crypto を使うため
// export const dynamic = 'force-dynamic'; // cookies() を内部で使うので安全側に

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; just_signed_up?: string }>;
}) {
  const searchParamsResolved = await searchParams;
  const justSignedUp = searchParamsResolved?.just_signed_up === '1';
  const next = searchParamsResolved?.next ?? undefined;
  if (next) {
    redirect(
      `/api/login/prepare?next=${encodeURIComponent(next)}${
        justSignedUp ? '&just_signed_up=1' : ''
      }`,
    );
  }
  // await setSignedReturnToCookie(searchParams?.next);

  return (
    <>
      <ClientLoginForm justSignedUp={justSignedUp} />
    </>
  );
}
