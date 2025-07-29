import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export class UserClient {
  static async get(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/user/${id}`)
      .set(setToken(token));
  }
}
