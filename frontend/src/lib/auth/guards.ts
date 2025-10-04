'use server';

import { headers } from 'next/headers';
import { readAccessTokenFromServer } from './cookies';
import { safeReturnTo } from './returnTo';
import { authMe } from './api';
import { redirect } from 'next/navigation';
import { UserData } from '../user/api';

export async function ensureAuthenticatedUser(): Promise<UserData | undefined> {
  const token = await readAccessTokenFromServer();

  const h = await headers();
  const current = h.get('x-current-path');
  const sanitized = current ? safeReturnTo(current) : undefined;

  const redirectToLogin = () =>
    // sanitized ? `/login?next=${encodeURIComponent(sanitized)}` : '/login';
    sanitized
      ? `/api/login/prepare?next=${encodeURIComponent(sanitized)}`
      : '/login';

  if (!token) {
    // ここで一度、POST? GET? api/session/next で setCookieする

    // その後、ログインページへリダイレクトする
    redirect(redirectToLogin());
    return;
  }

  const me = await authMe(token);
  if (!me.ok) {
    //await clearAccessTokenCookie(); //TODO Route Handler に移動する
    redirect(redirectToLogin());
  }

  return me.data;
}
