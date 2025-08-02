import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { AuthClient, UpdateUser } from 'test/clients/auth.client';
import { FollowClient } from 'test/clients/follow.client';
import { UserFactory } from 'test/factories/user.factory';

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
});
