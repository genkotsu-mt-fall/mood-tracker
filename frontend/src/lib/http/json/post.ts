import z from 'zod';
import { CommonOptions, HttpJsonResult, requestJson } from './base';

export type PostJsonOptions = CommonOptions;

export async function postJson<T>(
  url: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: PostJsonOptions,
): Promise<HttpJsonResult<T>> {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts?.headers ?? {}),
  };

  return requestJson<T>(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    },
    successSchema,
  );
}

export async function postJsonAuth<T>(
  url: string,
  payload: unknown,
  token: string,
  successSchema: z.ZodType<T>,
  opts?: Omit<PostJsonOptions, 'headers'>,
): Promise<HttpJsonResult<T>> {
  return postJson<T>(url, payload, successSchema, {
    ...opts,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
