import z from 'zod';
import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type GetJsonOptions = CommonOptions;

export async function getJson<T>(
  url: string,
  successSchema: z.ZodType<T>,
  opts?: GetJsonOptions,
): Promise<HttpJsonResult<T>> {
  return requestJson<T>(
    url,
    {
      method: 'GET',
      headers: opts?.headers,
    },
    successSchema,
  );
}

export async function getJsonAuth<T>(
  url: string,
  token: string,
  successSchema: z.ZodType<T>,
  opts?: Omit<GetJsonOptions, 'headers'>,
): Promise<HttpJsonResult<T>> {
  return getJson<T>(url, successSchema, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
