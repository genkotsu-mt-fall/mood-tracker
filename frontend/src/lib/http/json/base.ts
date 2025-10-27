import { getApiBaseUrl } from '@/lib/env';
import {
  ApiSuccess,
  ApiError,
  ApiResponse,
  makeApiResponseSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import z from 'zod';

export type HttpJsonResult<T> =
  | { ok: true; status: number; json: ApiSuccess<T> }
  | { ok: false; status: number; message: string; json?: ApiError }
  | { ok: false; status: 0; message: string }; // ネットワーク失敗等

export type CommonOptions = {
  headers?: Record<string, string>;
};

export async function safeJson<T>(
  res: Response,
  successSchema: z.ZodType<T>,
): Promise<ApiResponse<T> | undefined> {
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return undefined;
  }

  const responseSchema = makeApiResponseSchema(successSchema);
  const parsed = responseSchema.safeParse(raw);
  if (!parsed.success) {
    return undefined;
  }

  return parsed.data as ApiResponse<T>;
}

export async function requestJson<T>(
  url: string,
  init: RequestInit,
  successSchema: z.ZodType<T>,
): Promise<HttpJsonResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/${url}`, init);
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'ネットワークエラーが発生しました。',
    };
  }

  const json: ApiResponse<T> | undefined = await safeJson<T>(
    res,
    successSchema,
  );

  if (!res.ok) {
    const errorJson: ApiError | undefined =
      json && json.success === false ? json : undefined;

    const message =
      errorJson?.error.message || 'サーバーエラーが発生しました。';

    return {
      ok: false,
      status: res.status,
      message,
      json: errorJson,
    };
  }

  if (!json) {
    return {
      ok: false,
      status: res.status,
      message: 'サーバー応答の形式が不正です。',
    };
  }

  if (json.success === false) {
    return { ok: false, status: res.status, message: json.error.message, json };
  }

  return { ok: true, status: res.status, json };
}
