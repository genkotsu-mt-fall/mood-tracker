import z from 'zod';
import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type DelJsonOptions = CommonOptions;

export async function delJson<T>(
  url: string,
  successSchema: z.ZodType<T>,
  opts?: DelJsonOptions,
): Promise<HttpJsonResult<T>> {
  return requestJson<T>(
    url,
    {
      method: 'DELETE',
      headers: opts?.headers,
    },
    successSchema,
  );
}

export async function delJsonAuth<T>(
  url: string,
  token: string,
  successSchema: z.ZodType<T>,
  opts?: DelJsonOptions,
): Promise<HttpJsonResult<T>> {
  return delJson<T>(url, successSchema, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
