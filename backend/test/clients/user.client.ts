import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export class UserClient {
  static async get(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/user/${id}`)
      .set(setToken(token));
  }

  static async getFollowers(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/user/${id}/followers`)
      .set(setToken(token));
  }

  static async getFollowing(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/user/${id}/following`)
      .set(setToken(token));
  }

  static async getPosts(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/user/${id}/posts`)
      .set(setToken(token));
  }
}
