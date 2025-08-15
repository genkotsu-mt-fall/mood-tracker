import { FollowClient } from 'test/clients/follow.client';
import { UserFactory } from 'test/factories/user.factory';
import { ApiResponse, SupertestResponse } from 'test/types/api';

export class FollowUseCase {
  static async createFollowRelation(prefix: string) {
    const follower = await UserFactory.create(`${prefix}_follower`);
    const followee = await UserFactory.create(`${prefix}_followee`);

    const res: SupertestResponse<ApiResponse<{ id: string }>> =
      await FollowClient.follow(follower.accessToken, followee.profile.id);

    expect(res.status).toBe(201);

    return {
      followId: res.body.data.id,
      follower,
      followee,
    };
  }
}
