import z from 'zod';
import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type PutJsonOptions = CommonOptions;

export async function putJson<T>(
  url: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: PutJsonOptions,
): Promise<HttpJsonResult<T>> {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts?.headers ?? {}),
  };

  return requestJson<T>(
    url,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    },
    successSchema,
  );
}

export async function putJsonAuth<T>(
  url: string,
  payload: unknown,
  token: string,
  successSchema: z.ZodType<T>,
  opts?: PutJsonOptions,
): Promise<HttpJsonResult<T>> {
  return putJson<T>(url, payload, successSchema, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
