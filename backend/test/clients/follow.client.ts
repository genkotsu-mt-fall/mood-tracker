import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export class FollowClient {
  static async follow(followToken: string, followeeId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/follow')
      .set(setToken(followToken))
      .send({ followeeId });
  }
}
