import * as request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export class GroupClient {
  static async create(token: string, name?: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/group')
      .set(setToken(token))
      .send({ name });
  }

  static async get(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/group/${id}`)
      .set(setToken(token));
  }

  static async getAll(token: string, page = 1, limit = 10) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/group')
      .set(setToken(token))
      .query({ page, limit });
  }

  static async update(token: string, id: string, name: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .put(`/group/${id}`)
      .set(setToken(token))
      .send({ name });
  }

  static async delete(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .delete(`/group/${id}`)
      .set(setToken(token));
  }
}
