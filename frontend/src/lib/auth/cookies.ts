'use server';

import { cookies } from 'next/headers';
import { ACCESS_COOKIE } from './cookie-constants';

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
}

export async function readAccessTokenFromServer(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
