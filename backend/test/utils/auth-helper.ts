import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export type User = {
  email: string;
  password: string;
  name?: string;
};

export interface TestAuthedResponse extends request.Response {
  body: {
    access_token: string;
  };
}

export interface TestAuthedMeResponse extends request.Response {
  body: {
    id: string;
    email: string;
    name?: string;
  };
}

export const createAndLoginUser = async (
  prefix: string,
  app: INestApplication,
) => {
  const user = createUniqueUser(prefix);
  const token = await signupAndLogin(app, user);
  return { user, token };
};

export const getUser = async (
  app: INestApplication,
  token: string,
): Promise<TestAuthedMeResponse> => {
  return await request(app.getHttpServer())
    .get('/auth/me')
    .set(setToken(token))
    .expect(200);
};

export const createUniqueUser = (prefix: string): User => ({
  email: `${prefix}-${Date.now()}@example.com`,
  password: `password123`,
  name: `${prefix} Tester`,
});

export const setToken = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export async function signupAndLogin(
  app: INestApplication,
  user: User,
): Promise<string> {
  // signup
  await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email: user.email,
      password: user.password,
      name: user.name ?? undefined,
    })
    .expect(201);

  // login
  const loginRes: TestAuthedResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(201);

  return loginRes.body.access_token;
}
