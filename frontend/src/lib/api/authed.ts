import z from 'zod';
import { readAccessTokenFromServer } from '../auth/cookies';
import {
  delJsonAuth,
  DelJsonOptions,
  getJsonAuth,
  GetJsonOptions,
  HttpJsonResult,
  postJsonAuth,
  PostJsonOptions,
  putJsonAuth,
  PutJsonOptions,
} from '../http/json';
import { Fail, Ok, toOkFail } from '../http/result';

export async function authedMutate<
  T,
  O extends Omit<PostJsonOptions | PutJsonOptions, 'headers'> = PostJsonOptions,
>(
  url: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  fn: (
    url: string,
    payload: unknown,
    token: string,
    successSchema: z.ZodType<T>,
    opts?: O,
  ) => Promise<HttpJsonResult<T>>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<T> = await fn(
    url,
    payload,
    token,
    successSchema,
    opts,
  );
  return toOkFail<T>(r);
}

export async function authedPathOnly<
  T,
  O extends Omit<GetJsonOptions | DelJsonOptions, 'headers'> = GetJsonOptions,
>(
  url: string,
  successSchema: z.ZodType<T>,
  fn: (
    url: string,
    token: string,
    successSchema: z.ZodType<T>,
    opts?: O,
  ) => Promise<HttpJsonResult<T>>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<T> = await fn(url, token, successSchema, opts);
  return toOkFail<T>(r);
}

// シンタックスシュガー
export async function getRequest<T>(
  url: string,
  successSchema: z.ZodType<T>,
  opts?: Omit<GetJsonOptions, 'headers'>,
): Promise<Ok<T> | Fail> {
  return authedPathOnly<T>(url, successSchema, getJsonAuth, opts);
}

export async function postRequest<
  T,
  O extends Omit<PostJsonOptions, 'headers'> = PostJsonOptions,
>(
  url: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  return authedMutate<T, O>(url, payload, successSchema, postJsonAuth, opts);
}

export async function putRequest<
  T,
  O extends Omit<PutJsonOptions, 'headers'> = PutJsonOptions,
>(
  url: string,
  payload: unknown,
  successSchema: z.ZodType<T>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  return authedMutate<T, O>(url, payload, successSchema, putJsonAuth, opts);
}

export async function delRequest<
  T,
  O extends Omit<DelJsonOptions, 'headers'> = DelJsonOptions,
>(url: string, successSchema: z.ZodType<T>, opts?: O): Promise<Ok<T> | Fail> {
  return authedPathOnly<T>(url, successSchema, delJsonAuth, opts);
}
