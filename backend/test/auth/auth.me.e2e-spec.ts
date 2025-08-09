import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { AuthClient, UpdateUser } from 'test/clients/auth.client';
import { FollowClient } from 'test/clients/follow.client';
import { UserFactory } from 'test/factories/user.factory';
import { FollowUseCase } from 'test/usecases/follow.usecase';
import { PostUseCase } from 'test/usecases/post.usecase';

interface FollowUser {
  id: string;
  name: string;
  email: string;
}

describe('AuthController (GET, PUT /auth/me)', () => {
  const prefix = 'auth_me';
  const updatedName = 'Updated Name';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should get the current user profile', async () => {
    const user = await UserFactory.create(prefix);
    const body = await AuthClient.getProfile(user.accessToken);

    expect(body).toHaveProperty('id', user.profile.id);
    expect(body.email).toBe(user.profile.email);
    expect(body.name).toBe(user.profile.name);
  });

  it('should update the current user profile', async () => {
    const user = await UserFactory.create(prefix);

    const res = await AuthClient.updateProfile(user.accessToken, {
      name: updatedName,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', user.profile.id);
    expect(res.body.name).toBe(updatedName);
  });

  it('should update both name and email fields', async () => {
    const user = await UserFactory.create(prefix);
    const updatedEmail = `updated-${prefix}-${Date.now()}@example.com`;

    const res = await AuthClient.updateProfile(user.accessToken, {
      name: updatedName,
      email: updatedEmail,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', user.profile.id);
    expect(res.body.name).toBe(updatedName);
    expect(res.body.email).toBe(updatedEmail);
  });

  it('should return 401 if no access token is provided', async () => {
    const res = await AuthClient.updateProfile('', { name: updatedName });
    expect(res.status).toBe(401);
  });

  it('should return 400 when invalid fields are provided', async () => {
    const user = await UserFactory.create(prefix);
    const invalidFields = { nickname: updatedName } as unknown as UpdateUser;
    const res = await AuthClient.updateProfile(user.accessToken, invalidFields);
    expect(res.status).toBe(400);
  });

  // GET /auth/me/followers
  describe('GET /auth/me/followers', () => {
    it('should return followers of the current user', async () => {
      const userA = await UserFactory.create(`${prefix}_follower`);
      const userB = await UserFactory.create(`${prefix}_followed`);

      await FollowClient.follow(userA.accessToken, userB.profile.id);

      const res = await AuthClient.getFollowers(userB.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as FollowUser[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(1);
      expect(body[0]).toMatchObject({
        id: userA.profile.id,
        name: userA.profile.name,
        email: userA.profile.email,
      });
    });

    it('should return 401 if no access token is provided', async () => {
      const res = await AuthClient.getFollowers('');
      expect(res.status).toBe(401);
    });
  });

  // GET /auth/me/following
  describe('GET /auth/me/following', () => {
    it('should return following users of the current user', async () => {
      const userA = await UserFactory.create(`${prefix}_follower`);
      const userB = await UserFactory.create(`${prefix}_followed`);

      await FollowClient.follow(userA.accessToken, userB.profile.id);

      const res = await AuthClient.getFollowing(userA.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as FollowUser[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(1);
      expect(body[0]).toMatchObject({
        id: userB.profile.id,
        name: userB.profile.name,
        email: userB.profile.email,
      });
    });

    it('should return 401 if no access token is provided', async () => {
      const res = await AuthClient.getFollowing('');
      expect(res.status).toBe(401);
    });
  });

  // GET /auth/me/following/posts
  describe('GET /auth/me/following/posts', () => {
    // 認証されたユーザーが誰もフォローしていない場合、空のリストを返すべきです。
    it('Should return an empty list when the authenticated user is not following anyone', async () => {
      const user = await UserFactory.create(prefix);
      const res = await AuthClient.getFollowingPosts(user.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data).toEqual([]);
    });

    // 認証されたユーザーがフォローしているユーザーの投稿を取得できるべきです。
    it('Should return a paginated list of posts from followed users', async () => {
      const { follower } =
        await PostUseCase.createPostWithFollowerPrivacy(prefix);

      const res = await AuthClient.getFollowingPosts(follower.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(1);
    });

    // 認証されたユーザーがフォローしているユーザーの投稿を、作成日時の降順で取得できるべきです。
    it('Should return posts sorted by creation date in descending order', async () => {
      const {
        post: firstPost,
        follower,
        followee,
      } = await PostUseCase.createPostWithFollowerPrivacy(prefix);
      const { post: secondPost } = await PostUseCase.createPostWithToken(
        followee.accessToken,
        {
          body: 'Second Post',
          crisisFlag: false,
        },
      );

      const res = await AuthClient.getFollowingPosts(follower.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(2);
      expect(body.data[0].id).toBe(secondPost.id); // Newer post first
      expect(body.data[1].id).toBe(firstPost.id); // Older post second
    });

    // 認証されたユーザーがフォローしているユーザーの投稿を、ページネーションパラメータを指定して取得できるべきです。
    it('Should return the next page of results when page parameter is specified', async () => {
      const { follower, followee } =
        await PostUseCase.createPostWithFollowerPrivacy(prefix);
      const { post: post2 } = await PostUseCase.createPostWithToken(
        followee.accessToken,
        {
          body: 'Second Post',
          crisisFlag: false,
        },
      );

      const res = await AuthClient.getFollowingPostsWithPaginated(
        follower.accessToken,
        1,
        1,
      );

      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(1);
      expect(body.data[0].id).toBe(post2.id); // Should return the second post
    });

    it('Should return a validation error for invalid pagination parameters', async () => {
      const { follower } = await FollowUseCase.createFollowRelation(prefix);
      const res1 = await AuthClient.getFollowingPostsWithPaginated(
        follower.accessToken,
        -1,
        1,
      );
      expect(res1.status).toBe(400);

      const res2 = await AuthClient.getFollowingPostsWithPaginated(
        follower.accessToken,
        0,
        0,
      );
      expect(res2.status).toBe(400);
    });

    it('should return 401 if no access token is provided', async () => {
      const res = await AuthClient.getFollowingPosts('');
      expect(res.status).toBe(401);
    });
  });

  // GET /auth/me/posts
  describe('GET /auth/me/posts', () => {
    // 認証されたユーザーが投稿を持っていない場合、空のリストを返すべきです。
    it('Should return an empty list when the authenticated user has no posts', async () => {
      const user = await UserFactory.create(prefix);
      const res = await AuthClient.getOwnPosts(user.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data).toEqual([]);
    });

    // 認証されたユーザーの投稿を取得できるべきです。
    it('Should return a paginated list of the authenticated user’s posts', async () => {
      const { post, postOwner } = await PostUseCase.createPost(prefix, {
        body: `${prefix}_post_body`,
        crisisFlag: false,
      });

      const res = await AuthClient.getOwnPosts(postOwner.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(1);
      expect(body.data[0].id).toBe(post.id);
    });

    // 認証されたユーザーの投稿を、作成日時の降順で取得できるべきです。
    it('Should return posts sorted by creation date in descending order', async () => {
      const { post: firstPost, postOwner } = await PostUseCase.createPost(
        prefix,
        {
          body: `${prefix}_first_post_body`,
          crisisFlag: false,
        },
      );
      const { post: secondPost } = await PostUseCase.createPostWithToken(
        postOwner.accessToken,
        {
          body: `${prefix}_second_post_body`,
          crisisFlag: false,
        },
      );

      const res = await AuthClient.getOwnPosts(postOwner.accessToken);
      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(2);
      expect(body.data[0].id).toBe(secondPost.id); // Newer post first
      expect(body.data[1].id).toBe(firstPost.id); // Older post second
    });

    // 認証されたユーザーの投稿を、ページネーションパラメータを指定して取得できるべきです。
    it('Should return the next page of results when page parameter is specified', async () => {
      const { postOwner } = await PostUseCase.createPost(prefix, {
        body: `${prefix}_first_post_body`,
        crisisFlag: false,
      });
      const { post: secondPost } = await PostUseCase.createPostWithToken(
        postOwner.accessToken,
        {
          body: `${prefix}_second_post_body`,
          crisisFlag: false,
        },
      );

      const res = await AuthClient.getOwnPostsWithPaginated(
        postOwner.accessToken,
        1,
        1,
      );

      expect(res.status).toBe(200);
      const body = res.body as { data: PostResponseDto[] };
      expect(body.data.length).toBe(1);
      expect(body.data[0].id).toBe(secondPost.id); // Should return the second post
    });

    // 認証されたユーザーの投稿を、ページネーションパラメータが無効な場合はエラーを返すべきです。
    it('Should return a validation error for invalid pagination parameters', async () => {
      const { postOwner } = await PostUseCase.createPost(prefix, {
        body: `${prefix}_post_body`,
        crisisFlag: false,
      });

      const res1 = await AuthClient.getOwnPostsWithPaginated(
        postOwner.accessToken,
        -1,
        1,
      );
      expect(res1.status).toBe(400);

      const res2 = await AuthClient.getOwnPostsWithPaginated(
        postOwner.accessToken,
        0,
        0,
      );
      expect(res2.status).toBe(400);
    });

    it('should return 401 if no access token is provided', async () => {
      const res = await AuthClient.getOwnPosts('');
      expect(res.status).toBe(401);
    });
  });
});
