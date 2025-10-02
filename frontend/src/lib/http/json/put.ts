import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type PutJsonOptions = CommonOptions;

export async function putJson<T>(
  url: string,
  payload: unknown,
  opts?: PutJsonOptions,
): Promise<HttpJsonResult<T>> {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts?.headers ?? {}),
  };

  return requestJson<T>(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
}

export async function putJsonAuth<T>(
  url: string,
  payload: unknown,
  token: string,
  opts?: PutJsonOptions,
): Promise<HttpJsonResult<T>> {
  return putJson<T>(url, payload, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
