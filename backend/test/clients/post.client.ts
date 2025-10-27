import { PrivacySetting } from 'src/post/type/privacy-setting.type';
// import request from 'supertest';
import request from 'supertest';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { setToken } from 'test/utils/auth-helper';

export interface PostCreateParams {
  body: string;
  crisisFlag: boolean;
  mood?: string;
  intensity?: number;
  emoji?: string;
  templateId?: string;
  privacyJson?: PrivacySetting;
}

export type PostUpdateParams = Partial<PostCreateParams>;

export class PostClient {
  static async create(token: string, params: PostCreateParams) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/post')
      .set(setToken(token))
      .send(params);
  }

  static async get(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/post/${id}`)
      .set(setToken(token));
  }

  static async getAll(token: string, page = 1, limit = 10) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get('/post')
      .set(setToken(token))
      .query({ page, limit });
  }

  static async update(token: string, id: string, params: PostUpdateParams) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .put(`/post/${id}`)
      .set(setToken(token))
      .send(params);
  }

  static async delete(token: string, id: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .delete(`/post/${id}`)
      .set(setToken(token));
  }
}
