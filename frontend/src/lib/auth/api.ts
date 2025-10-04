import { getJsonAuth, postJson } from '../http/json';
import { Ok, Fail, toOkFail } from '../http/result';
import { UserData } from '../user/api';

export type LoginData = { accessToken: string };

export async function authLogin(
  email: string,
  password: string,
): Promise<Ok<LoginData> | Fail> {
  const r = await postJson<LoginData>('auth/login', {
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
  const r = await postJson<UserData>('auth/signup', params);
  return toOkFail<UserData>(r);
}

export async function authMe(token: string): Promise<Ok<UserData> | Fail> {
  const r = await getJsonAuth<UserData>('auth/me', token);
  return toOkFail<UserData>(r);
}
