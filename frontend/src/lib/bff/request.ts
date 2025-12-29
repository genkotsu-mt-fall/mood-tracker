import z from 'zod';
import type { Fail, Ok } from '@/lib/http/result';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function normalizeFields(
  fields: unknown,
): Record<string, string[]> | undefined {
  if (!isRecord(fields)) return undefined;

  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === 'string') out[k] = [v];
    else if (Array.isArray(v) && v.every((x) => typeof x === 'string'))
      out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

async function readJsonSafely(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function mergeHeaders(
  base: HeadersInit | undefined,
  add: Record<string, string>,
): HeadersInit {
  const h = new Headers(base);
  for (const [k, v] of Object.entries(add)) h.set(k, v);
  return h;
}

export type BffRequestOptions = Omit<RequestInit, 'body' | 'method'>;

export async function bffRequest<T>(
  path: string,
  init: RequestInit,
  successSchema: z.ZodType<T>,
): Promise<Ok<T> | Fail> {
  let res: Response;

  try {
    res = await fetch(path, {
      credentials: 'same-origin',
      ...init,
    });
  } catch (e) {
    const message =
      e instanceof Error && e.message ? e.message : 'Network error';
    return { ok: false, status: 0, message };
  }

  const j = await readJsonSafely(res);

  if (!isRecord(j) || typeof j.ok !== 'boolean') {
    return {
      ok: false,
      status: res.status || 0,
      message: 'API 応答形式が不正です。',
    };
  }

  if (j.ok) {
    const parsed = successSchema.safeParse(j.data);
    if (!parsed.success) {
      return {
        ok: false,
        status: 502,
        message: 'API 応答形式が不正です。',
        details: parsed.error.flatten(),
      };
    }
    return { ok: true, data: parsed.data };
  }

  return {
    ok: false,
    status: res.status || 0,
    message:
      typeof j.message === 'string' && j.message ? j.message : 'Request failed',
    fields: normalizeFields(j.fields),
    code: typeof j.code === 'string' ? j.code : undefined,
    details: 'details' in j ? j.details : undefined,
  };
}

export async function bffGet<T>(
  path: string,
  successSchema: z.ZodType<T>,
  opts?: BffRequestOptions,
): Promise<Ok<T> | Fail> {
  return bffRequest<T>(path, { method: 'GET', ...opts }, successSchema);
}

export async function bffPost<T>(
  path: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: BffRequestOptions,
): Promise<Ok<T> | Fail> {
  return bffRequest<T>(
    path,
    {
      method: 'POST',
      headers: mergeHeaders(opts?.headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
      ...opts,
    },
    successSchema,
  );
}

export async function bffPut<T>(
  path: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: BffRequestOptions,
): Promise<Ok<T> | Fail> {
  return bffRequest<T>(
    path,
    {
      method: 'PUT',
      headers: mergeHeaders(opts?.headers, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
      ...opts,
    },
    successSchema,
  );
}

export async function bffDel<T>(
  path: string,
  successSchema: z.ZodType<T>,
  opts?: BffRequestOptions,
): Promise<Ok<T> | Fail> {
  return bffRequest<T>(path, { method: 'DELETE', ...opts }, successSchema);
}

export function unwrapOrThrow<T>(r: Ok<T> | Fail): T {
  if (!r.ok) throw new Error(r.message);
  return r.data;
}
