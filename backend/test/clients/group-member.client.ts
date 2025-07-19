import * as request from 'supertest';
import { AppBootstrapper } from '../../test/bootstrap/app-bootstrapper';
import { setToken } from '../../test/utils/auth-helper';

export class GroupMemberClient {
  static async join(token: string, groupId: string, memberId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .post('/group-member')
      .set(setToken(token))
      .send({ groupId, memberId });
  }

  static async get(token: string, groupMemberId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .get(`/group-member/${groupMemberId}`)
      .set(setToken(token));
  }

  static async remove(token: string, groupMemberId: string) {
    return await request(AppBootstrapper.getApp().getHttpServer())
      .delete(`/group-member/${groupMemberId}`)
      .set(setToken(token));
  }
}
