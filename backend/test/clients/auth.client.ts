import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export interface AuthUser {
  email: string;
  password: string;
  name?: string;
}

export interface AuthTokenResponse extends request.Response {
  body: {
    access_token: string;
  };
}

export interface UserProfileResponse extends request.Response {
  body: {
    id: string;
    email: string;
    name?: string;
  };
}

export class AuthClient {
  static async register(user: AuthUser) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/auth/signup')
      .send({
        email: user.email,
        password: user.password,
        name: user.name ?? undefined,
      })
      .expect(201);
  }

  static async login(user: Pick<AuthUser, 'email' | 'password'>) {
    const res: AuthTokenResponse = await request(
      AppBootstrapper.getApp().getHttpServer(),
    )
      .post('/auth/login')
      .send(user)
      .expect(201);

    return {
      accessToken: res.body.access_token,
    };
  }

  static async getProfile(token: string) {
    const res: UserProfileResponse = await request(
      AppBootstrapper.getApp().getHttpServer(),
    )
      .get('/auth/me')
      .set(setToken(token))
      .expect(200);

    return res.body;
  }

  static async registerAndLogin(user: AuthUser) {
    await this.register(user);
    const { accessToken } = await this.login(user);
    const profile = await this.getProfile(accessToken);
    return { accessToken, profile };
  }
}
