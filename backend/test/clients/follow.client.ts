import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export class FollowClient {
  static async follow(token: string, followeeId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/follow')
      .set(setToken(token))
      .send({ followeeId });
  }

  static async unfollow(token: string, followId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .delete(`/follow/${followId}`)
      .set(setToken(token));
  }

  static async getFollow(token: string, followId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/follow/${followId}`)
      .set(setToken(token));
  }
}
