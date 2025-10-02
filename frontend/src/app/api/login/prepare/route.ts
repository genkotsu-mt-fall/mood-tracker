import { setSignedReturnToCookie } from '@/lib/auth/returnToCookie';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const JUST_SIGNED_UP = 'just_signed_up';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('next') ?? undefined;
  const justSignedUp = searchParams.get(JUST_SIGNED_UP) === '1';

  await setSignedReturnToCookie(next);
  const redirectUrl = new URL(`/login`, req.url);
  if (justSignedUp) redirectUrl.searchParams.set(JUST_SIGNED_UP, '1');
  return NextResponse.redirect(redirectUrl);
}
