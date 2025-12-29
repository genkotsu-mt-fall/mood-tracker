import { NextResponse } from 'next/server';
import type { Fail } from '@/lib/http/result';

function normalizeStatus(status: number): number {
  // fetch のネットワーク失敗等の 0 は HTTP として返せないので 502 に正規化
  return status === 0 ? 502 : status;
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonFail(f: Fail) {
  return NextResponse.json(
    { ok: false, message: f.message, fields: f.fields },
    { status: normalizeStatus(f.status) },
  );
}

export function jsonBadRequest(
  message: string,
  fields?: Record<string, string>,
) {
  return NextResponse.json({ ok: false, message, fields }, { status: 400 });
}
