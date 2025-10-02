import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_PREFIXES } from './constants/protected-prefixes';
import { ACCESS_COOKIE } from './lib/auth/cookie-constants';
import { safeReturnTo } from './lib/auth/returnTo';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => p === pathname || pathname.startsWith(p + '/'),
  );
  // 保護されていないパスならそのまま通す
  if (!isProtected) return NextResponse.next();

  const rawCurrentPath = pathname + search;
  const sanitized = safeReturnTo(rawCurrentPath);

  // 通過時は「現在URL」を上流に渡す（失効時でも元の場所へ戻すため）
  const requestHeaders = new Headers(req.headers);
  if (sanitized) requestHeaders.set('x-current-path', sanitized);

  // ログイン済みならそのまま通す
  const hasToken = req.cookies.has(ACCESS_COOKIE);
  if (hasToken)
    return NextResponse.next({ request: { headers: requestHeaders } });

  // ここで一度、POST? GET? api/session/next で setCookieする

  // その後、ログインページへリダイレクトする
  // const loginUrl = new URL('/login', req.url);
  // if (sanitized) loginUrl.searchParams.set('next', sanitized);
  // return NextResponse.redirect(loginUrl);
  const apiUrl = new URL('/api/login/prepare', req.url);
  if (sanitized) apiUrl.searchParams.set('next', sanitized);
  return NextResponse.redirect(apiUrl);
}

export const config = {
  matcher: [
    '/feed/:path*',
    '/compose/:path*',
    '/groups/:path*',
    '/me/:path*',
    '/settings/:path*',
  ],
};
