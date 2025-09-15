'use server';

import { cookies } from 'next/headers';

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: '_access',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
}
