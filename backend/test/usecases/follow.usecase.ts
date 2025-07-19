import { FollowClient } from '../../test/clients/follow.client';
import { UserFactory } from '../../test/factories/user.factory';

export class FollowUseCase {
  static async createFollowRelation(prefix: string) {
    const follower = await UserFactory.create(`${prefix}_follower`);
    const followee = await UserFactory.create(`${prefix}_followee`);

    const res = await FollowClient.follow(
      follower.accessToken,
      followee.profile.id,
    );

    expect(res.status).toBe(201);

    const body = res.body as { id: string };
    return {
      followId: body.id,
      follower,
      followee,
    };
  }
}
