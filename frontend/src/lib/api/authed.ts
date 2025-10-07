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
  fn: (
    url: string,
    payload: unknown,
    token: string,
    opts?: O,
  ) => Promise<HttpJsonResult<T>>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<T> = await fn(url, payload, token, opts);
  return toOkFail<T>(r);
}

export async function authedPathOnly<
  T,
  O extends Omit<GetJsonOptions | DelJsonOptions, 'headers'> = GetJsonOptions,
>(
  url: string,
  fn: (url: string, token: string, opts?: O) => Promise<HttpJsonResult<T>>,
  opts?: O,
): Promise<Ok<T> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };
  const r: HttpJsonResult<T> = await fn(url, token, opts);
  return toOkFail<T>(r);
}

// シンタックスシュガー
export async function getRequest<T>(
  url: string,
  opts?: Omit<GetJsonOptions, 'headers'>,
): Promise<Ok<T> | Fail> {
  return authedPathOnly<T>(url, getJsonAuth, opts);
}

export async function postRequest<
  T,
  O extends Omit<PostJsonOptions, 'headers'> = PostJsonOptions,
>(url: string, payload: unknown, opts?: O): Promise<Ok<T> | Fail> {
  return authedMutate<T, O>(url, payload, postJsonAuth, opts);
}

export async function putRequest<
  T,
  O extends Omit<PutJsonOptions, 'headers'> = PutJsonOptions,
>(url: string, payload: unknown, opts?: O): Promise<Ok<T> | Fail> {
  return authedMutate<T, O>(url, payload, putJsonAuth, opts);
}

export async function delRequest<
  T,
  O extends Omit<DelJsonOptions, 'headers'> = DelJsonOptions,
>(url: string, opts?: O): Promise<Ok<T> | Fail> {
  return authedPathOnly<T>(url, delJsonAuth, opts);
}
