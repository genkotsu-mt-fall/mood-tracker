import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { FollowClient } from 'test/clients/follow.client';
import { UserClient } from 'test/clients/user.client';
import { UserFactory } from 'test/factories/user.factory';
import { ApiResponse, SupertestResponse } from 'test/types/api';
import { GroupMemberUseCase } from 'test/usecases/group-member.usecase';
import { PostUseCase } from 'test/usecases/post.usecase';

interface FollowUser {
  id: string;
  name: string;
  email: string;
}

describe('UserController (GET /user/:id)', () => {
  const prefix = 'user_get';
  const NON_EXISTENT_USER_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  describe('GET /user', () => {
    it('should return all users with auth', async () => {
      const userA = await UserFactory.create(prefix);
      const userB = await UserFactory.create(prefix);
      const res: SupertestResponse<
        ApiResponse<{ id: string; name: string; email: string }[]>
      > = await UserClient.getAll(userA.accessToken);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should return a specific user with auth', async () => {
    const user = await UserFactory.create(prefix);
    const res: SupertestResponse<
      ApiResponse<{ id: string; name: string; email: string }>
    > = await UserClient.get(user.accessToken, user.profile.id);
    expect(res.status).toBe(200);

    expect(res.body.data.id).toBe(user.profile.id);
    expect(res.body.data.name).toBe(user.profile.name);
    expect(res.body.data.email).toBe(user.profile.email);
  });

  it('should return 401 if no token is provided', async () => {
    const user = await UserFactory.create(prefix);
    const res = await UserClient.get('', user.profile.id);
    expect(res.status).toBe(401);
  });

  it('should return 400 if id is not UUID', async () => {
    const user = await UserFactory.create(prefix);
    const res = await UserClient.get(user.accessToken, 'invalid-uuid');
    expect(res.status).toBe(400);
  });

  it('should return 404 if user is not found', async () => {
    const user = await UserFactory.create(prefix);
    const res = await UserClient.get(user.accessToken, NON_EXISTENT_USER_ID);
    expect(res.status).toBe(404);
  });

  describe('GET /user/:id/followers', () => {
    it('should return followers of the user', async () => {
      const userA = await UserFactory.create(prefix);
      const userB = await UserFactory.create(prefix);

      // Simulate userA following userB
      await FollowClient.follow(userA.accessToken, userB.profile.id);

      const res: SupertestResponse<ApiResponse<FollowUser[]>> =
        await UserClient.getFollowers(userA.accessToken, userB.profile.id);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toMatchObject({
        id: userA.profile.id,
        name: userA.profile.name,
        email: userA.profile.email,
      });
    });

    it('should return 401 if no token is provided', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowers('', user.profile.id);
      expect(res.status).toBe(401);
    });

    it('should return 400 if id is not UUID', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowers(
        user.accessToken,
        'invalid-uuid',
      );
      expect(res.status).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowers(
        user.accessToken,
        NON_EXISTENT_USER_ID,
      );
      expect(res.status).toBe(404);
    });
  });

  describe('GET /user/:id/following', () => {
    it('should return following of the user', async () => {
      const userA = await UserFactory.create(prefix);
      const userB = await UserFactory.create(prefix);

      // Simulate userA following userB
      await FollowClient.follow(userA.accessToken, userB.profile.id);

      const res: SupertestResponse<ApiResponse<FollowUser[]>> =
        await UserClient.getFollowing(userB.accessToken, userA.profile.id);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toMatchObject({
        id: userB.profile.id,
        name: userB.profile.name,
        email: userB.profile.email,
      });
    });

    it('should return 401 if no token is provided', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowing('', user.profile.id);
      expect(res.status).toBe(401);
    });

    it('should return 400 if id is not UUID', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowing(
        user.accessToken,
        'invalid-uuid',
      );
      expect(res.status).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getFollowing(
        user.accessToken,
        NON_EXISTENT_USER_ID,
      );
      expect(res.status).toBe(404);
    });
  });

  describe('GET /user/:id/posts', () => {
    // 認証されたユーザーが投稿を持っていない場合、空のリストを返すべきです。
    it('should return 200 and a paginated list of posts when the specified user exists and has posts', async () => {
      const user = await UserFactory.create(prefix);
      const viewer = await UserFactory.create(prefix);
      const res = await UserClient.getPosts(
        viewer.accessToken,
        user.profile.id,
      );
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBe(0);
    });

    // 認証されたユーザーの投稿を取得できるべきです。
    it('should return 200 and an empty list when the specified user exists but has no posts', async () => {
      const { post, postOwner } = await PostUseCase.createPost(prefix, {
        body: `${prefix}_post_body`,
        crisisFlag: false,
      });
      const viewer = await UserFactory.create(prefix);
      const res = await UserClient.getPosts(
        viewer.accessToken,
        postOwner.profile.id,
      );
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBe(1);
      expect(body.data[0]).toHaveProperty('id', post.id);
    });

    // 認証されたユーザーが存在しない場合、404を返すべきです。
    it('should return 404 when the specified user does not exist', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getPosts(
        user.accessToken,
        NON_EXISTENT_USER_ID,
      );
      expect(res.status).toBe(404);
    });

    // ユーザIDがUUIDでない
    it('should return 400 when the provided user ID is not a valid UUID', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getPosts(user.accessToken, 'invalid-uuid');
      expect(res.status).toBe(400);
    });

    // 認証されていない場合、401を返すべきです。
    it('should return 401 when no access token is provided', async () => {
      const user = await UserFactory.create(prefix);
      const res = await UserClient.getPosts('', user.profile.id);
      expect(res.status).toBe(401);
    });

    it('should return only posts the viewer is allowed to see based on each post’s visibility settings', async () => {
      const {
        post: memberViewablePost,
        group,
        groupOwner,
      } = await PostUseCase.createPostWithGroupPrivacy(prefix);

      const { member } = await GroupMemberUseCase.joinAsMember(
        prefix,
        groupOwner.accessToken,
        group.id,
      );

      const { post: everyoneViewablePost } =
        await PostUseCase.createPostWithToken(groupOwner.accessToken, {
          body: 'Test post body',
          crisisFlag: false,
        });

      const resMemberView = await UserClient.getPosts(
        member.accessToken,
        groupOwner.profile.id,
      );

      const bodyMemberView = resMemberView.body as { data: PostResponseDto[] };
      expect(resMemberView.status).toBe(200);
      expect(Array.isArray(bodyMemberView.data)).toBe(true);
      expect(bodyMemberView.data.length).toBe(2);
      expect(bodyMemberView.data[0]).toHaveProperty(
        'id',
        everyoneViewablePost.id,
      );
      expect(bodyMemberView.data[1]).toHaveProperty(
        'id',
        memberViewablePost.id,
      );

      const other = await UserFactory.create(prefix);
      const resOtherView = await UserClient.getPosts(
        other.accessToken,
        groupOwner.profile.id,
      );

      const bodyOtherView = resOtherView.body as { data: PostResponseDto[] };
      expect(resOtherView.status).toBe(200);
      expect(Array.isArray(bodyOtherView.data)).toBe(true);
      expect(bodyOtherView.data.length).toBe(1);
    });
  });
});
