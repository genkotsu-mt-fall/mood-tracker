import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { UserClient } from 'test/clients/user.client';
import { UserFactory } from 'test/factories/user.factory';

describe('UserController (GET /user/:id)', () => {
  const prefix = 'user_get';

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
    const nonExistentUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const res = await UserClient.get(user.accessToken, nonExistentUserId);
    expect(res.status).toBe(404);
  });
});
