import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type GetJsonOptions = CommonOptions;

export async function getJson<T>(
  url: string,
  opts?: GetJsonOptions,
): Promise<HttpJsonResult<T>> {
  return requestJson<T>(url, {
    method: 'GET',
    headers: opts?.headers,
  });
}

export async function getJsonAuth<T>(
  url: string,
  token: string,
  opts?: Omit<GetJsonOptions, 'headers'>,
): Promise<HttpJsonResult<T>> {
  return getJson<T>(url, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
