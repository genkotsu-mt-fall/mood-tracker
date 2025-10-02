import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type DelJsonOptions = CommonOptions;

export async function delJson<T>(
  url: string,
  opts?: DelJsonOptions,
): Promise<HttpJsonResult<T>> {
  return requestJson<T>(url, {
    method: 'DELETE',
    headers: opts?.headers,
  });
}

export async function delJsonAuth<T>(
  url: string,
  token: string,
  opts?: DelJsonOptions,
): Promise<HttpJsonResult<T>> {
  return delJson<T>(url, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
