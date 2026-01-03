import { NextResponse } from 'next/server';
import { clearAccessTokenCookie } from '@/lib/auth/cookies';

function redirectToLogin(req: Request) {
  return NextResponse.redirect(new URL('/login', req.url), { status: 303 });
}

// セキュリティを厳密にするなら GET は消して POST のみにしてください。
// ただ「リンクでログアウト」をしたい場合は GET を残すのが楽です。
export async function GET(req: Request) {
  await clearAccessTokenCookie();
  return redirectToLogin(req);
}

export async function POST(req: Request) {
  await clearAccessTokenCookie();
  return redirectToLogin(req);
}
