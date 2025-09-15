import { getApiBaseUrl } from '../env';
import { postJson } from '../http/json';
import { Ok, Fail, toOkFail } from '../http/result';

export type LoginData = { accessToken: string };
export type UserData = { id: string; email: string; name?: string | null };

export async function authLogin(
  email: string,
  password: string,
): Promise<Ok<LoginData> | Fail> {
  const r = await postJson<LoginData>(`${getApiBaseUrl()}/auth/login`, {
    email,
    password,
  });
  return toOkFail<LoginData>(r);
}

export async function authSignup(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<Ok<UserData> | Fail> {
  const r = await postJson<UserData>(`${getApiBaseUrl()}/auth/signup`, params);
  return toOkFail<UserData>(r);
}
