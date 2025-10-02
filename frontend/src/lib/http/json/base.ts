import { getApiBaseUrl } from '@/lib/env';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    details?: string;
  };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type HttpJsonResult<T> =
  | { ok: true; status: number; json: ApiSuccess<T> }
  | { ok: false; status: number; message: string; json?: ApiError }
  | { ok: false; status: 0; message: string }; // ネットワーク失敗等

export type CommonOptions = {
  headers?: Record<string, string>;
};

export async function safeJson<T>(
  res: Response,
): Promise<ApiResponse<T> | undefined> {
  try {
    return (await res.json()) as ApiResponse<T>;
  } catch {
    return undefined;
  }
}

export async function requestJson<T>(
  url: string,
  init: RequestInit,
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

  const json = await safeJson<T>(res);

  if (!res.ok) {
    const message =
      (json &&
        'success' in json &&
        json.success === false &&
        json.error.message) ||
      'サーバーエラーが発生しました。';
    return {
      ok: false,
      status: res.status,
      message,
      json: json as ApiError | undefined,
    };
  }

  if (!json || !('success' in json)) {
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
