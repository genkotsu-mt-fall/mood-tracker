'use server';

import crypto from 'node:crypto';
import { safeReturnTo } from './returnTo';
import { cookies } from 'next/headers';

const COOKIE_NAME = '_return_to';
const SIG_NAME = '_return_to_sig';
const MAX_AGE_SEC = 300; // 有効期限: 5分
const SECRET = process.env.RETURN_TO_SECRET || '';
const isProd = process.env.NODE_ENV === 'production';

const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const, // ワイドニングせず、リテラル型として判定させる
  path: '/',
  maxAge: MAX_AGE_SEC,
};

function b64urlEncodeUtf8(s: string) {
  return Buffer.from(s, 'utf-8').toString('base64url');
}

function b64urlDecodeUtf8(b64url: string) {
  return Buffer.from(b64url, 'base64url').toString('utf-8');
}

function hmacHex(input: string) {
  return crypto.createHmac('sha256', SECRET).update(input).digest('hex');
}

function tsecEqualHex(aHex: string, bHex: string): boolean {
  try {
    const a = Buffer.from(aHex, 'hex');
    const b = Buffer.from(bHex, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function setSignedReturnToCookie(rawPath: string | undefined) {
  if (!SECRET) return;

  const p = rawPath ? safeReturnTo(rawPath) : undefined;
  if (!p) return;

  const payload = JSON.stringify({ path: p, issuedAt: Date.now() });
  const payloadB64Url = b64urlEncodeUtf8(payload);
  const signature = hmacHex(payloadB64Url);

  const cookiesStore = await cookies();
  cookiesStore.set(COOKIE_NAME, payloadB64Url, cookieOpts);
  cookiesStore.set(SIG_NAME, signature, cookieOpts);
}

export async function consumeSignedReturnTo(): Promise<string | undefined> {
  const cookiesStore = await cookies();
  const payloadB64Url = cookiesStore.get(COOKIE_NAME)?.value;
  const signature = cookiesStore.get(SIG_NAME)?.value;

  // クッキー削除（再利用防止）
  cookiesStore.delete(COOKIE_NAME);
  cookiesStore.delete(SIG_NAME);

  if (!SECRET || !payloadB64Url || !signature) return;

  const expectedSignature = hmacHex(payloadB64Url);
  if (!tsecEqualHex(signature, expectedSignature)) return;

  let obj;
  try {
    const json = b64urlDecodeUtf8(payloadB64Url);
    obj = JSON.parse(json);
  } catch {
    return;
  }

  if (
    !obj ||
    'path' in obj === false ||
    'issuedAt' in obj === false ||
    typeof obj.path !== 'string' ||
    typeof obj.issuedAt !== 'number'
  ) {
    return;
  }

  const elapsed = Date.now() - obj.issuedAt;
  if (elapsed < 0 || elapsed > MAX_AGE_SEC * 1000) return;

  const safePath = safeReturnTo(obj.path);
  return safePath ?? undefined;
}
