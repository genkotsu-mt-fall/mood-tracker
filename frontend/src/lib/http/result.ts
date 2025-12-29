import type { HttpJsonResult } from './json';

export type Ok<T> = { ok: true; data: T };

export type Fail = {
  ok: false;
  status: number; // ← 追加（0 はネットワーク等）
  message: string;
  fields?: Record<string, string[]>;
  code?: string;
  details?: unknown;
};

export function toOkFail<T>(res: HttpJsonResult<T>): Ok<T> | Fail {
  if (res.ok) {
    return { ok: true, data: res.json.data };
  }

  const err = 'json' in res && res.json ? res.json.error : undefined;

  return {
    ok: false,
    status: res.status,
    message: res.message,
    fields: err?.fields ?? undefined,
    code: err?.code,
    details: err?.details,
  };
}
