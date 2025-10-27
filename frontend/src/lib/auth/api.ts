import {
  AuthLoginResponse,
  AuthLoginResponseSchema,
  AuthSignupBodySchema,
  AuthSignupResponseSchema,
  UserResource,
  UserResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { getJsonAuth, postJson } from '../http/json';
import { Ok, Fail, toOkFail } from '../http/result';

export async function authLogin(
  email: string,
  password: string,
): Promise<Ok<AuthLoginResponse> | Fail> {
  const r = await postJson<AuthLoginResponse>(
    'auth/login',
    {
      email,
      password,
    },
    AuthLoginResponseSchema,
  );
  return toOkFail<AuthLoginResponse>(r);
}

export async function authSignup(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<Ok<UserResource> | Fail> {
  const r = await postJson<UserResource>(
    'auth/signup',
    params,
    AuthSignupResponseSchema,
  );
  return toOkFail<UserResource>(r);
}

export async function authMe(token: string): Promise<Ok<UserResource> | Fail> {
  const r = await getJsonAuth<UserResource>(
    'auth/me',
    token,
    UserResourceSchema,
  );
  return toOkFail<UserResource>(r);
}
