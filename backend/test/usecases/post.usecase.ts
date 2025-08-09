import { PrivacySetting } from 'src/post/type/privacy-setting.type';
import { PostClient, PostCreateParams } from 'test/clients/post.client';
import { UserFactory } from 'test/factories/user.factory';
import { GroupUseCase } from './group.usecase';
import { FollowUseCase } from './follow.usecase';

export class PostUseCase {
  static async createPost(prefix: string, params: PostCreateParams) {
    const user = await UserFactory.create(prefix);
    const { post } = await this.createPostWithToken(user.accessToken, params);
    return { post, postOwner: user };
  }

  static async createPostWithToken(token: string, params: PostCreateParams) {
    const res = await PostClient.create(token, params);
    expect(res.status).toBe(201);
    const body = res.body as {
      id: string;
      body: string;
      crisisFlag: boolean;
      mood?: string;
      intensity?: number;
      emoji?: string;
      templateId?: string;
      privacyJson?: PrivacySetting;
    };
    return { post: body };
  }

  static async createPostWithGroupPrivacy(prefix: string) {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const params: PostCreateParams = {
      body: `${prefix}_post_body`,
      crisisFlag: false,
      privacyJson: {
        allow_groups: [group.id],
        group_visibility_mode: 'any',
      },
    };
    const { post } = await this.createPostWithToken(
      groupOwner.accessToken,
      params,
    );
    return { post, group, groupOwner };
  }

  static async createPostWithFollowerPrivacy(prefix: string) {
    const { follower, followee } =
      await FollowUseCase.createFollowRelation(prefix);
    const postParams: PostCreateParams = {
      body: 'Followers-only post',
      crisisFlag: false,
      privacyJson: {
        followers_only: true,
      },
    };
    const { post } = await this.createPostWithToken(
      followee.accessToken,
      postParams,
    );
    return { post, follower, followee };
  }
}
