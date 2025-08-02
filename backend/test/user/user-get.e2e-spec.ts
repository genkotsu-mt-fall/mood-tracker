import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { FollowClient } from 'test/clients/follow.client';
import { UserClient } from 'test/clients/user.client';
import { UserFactory } from 'test/factories/user.factory';

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

  it('should return a specific user with auth', async () => {
    const user = await UserFactory.create(prefix);
    const res = await UserClient.get(user.accessToken, user.profile.id);
    expect(res.status).toBe(200);

    const body = res.body as { id: string; name: string; email: string };
    expect(body.id).toBe(user.profile.id);
    expect(body.name).toBe(user.profile.name);
    expect(body.email).toBe(user.profile.email);
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

      const res = await UserClient.getFollowers(
        userA.accessToken,
        userB.profile.id,
      );
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

      const res = await UserClient.getFollowing(
        userB.accessToken,
        userA.profile.id,
      );
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
});
