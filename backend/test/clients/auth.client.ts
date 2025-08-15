import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { ApiResponse, SupertestResponse } from 'test/types/api';
import { setToken } from 'test/utils/auth-helper';

export interface AuthUser {
  email: string;
  password: string;
  name?: string;
}

export type UpdateUser = Omit<Partial<AuthUser>, 'password'>;

export type AuthTokenResponse = SupertestResponse<
  ApiResponse<{ accessToken: string }>
>;

export type UserProfileResponse = SupertestResponse<
  ApiResponse<{
    id: string;
    email: string;
    name?: string;
  }>
>;

export class AuthClient {
  static async register(user: AuthUser): Promise<UserProfileResponse> {
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
      .expect(200);

    const accessToken = res.body.data.accessToken;
    return {
      accessToken,
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

  static async updateProfile(
    token: string,
    user: UpdateUser,
  ): Promise<UserProfileResponse> {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .put('/auth/me')
      .set(setToken(token))
      .send({ ...user });
  }

  static async registerAndLogin(user: AuthUser) {
    await this.register(user);
    const { accessToken } = await this.login(user);
    const res = await this.getProfile(accessToken);
    return { accessToken, profile: res.data };
  }

  static async getFollowers(token: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/followers')
      .set(setToken(token));
  }

  static async getFollowing(token: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/following')
      .set(setToken(token));
  }

  static async getFollowingPosts(token: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/following/posts')
      .set(setToken(token));
  }

  static async getFollowingPostsWithPaginated(
    token: string,
    page: number,
    limit: number,
  ) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/following/posts')
      .query({ page, limit })
      .set(setToken(token));
  }

  static async getOwnPosts(token: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/posts')
      .set(setToken(token));
  }

  static async getOwnPostsWithPaginated(
    token: string,
    page: number,
    limit: number,
  ) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/auth/me/posts')
      .query({ page, limit })
      .set(setToken(token));
  }
}
