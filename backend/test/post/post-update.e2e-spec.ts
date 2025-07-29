import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { PostClient } from 'test/clients/post.client';
import { UserFactory } from 'test/factories/user.factory';
import { PostUseCase } from 'test/usecases/post.usecase';

describe('PostController (PUT /post/:id)', () => {
  const prefix = 'post_update';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should update post if user is owner', async () => {
    const { post, postOwner } = await PostUseCase.createPost(prefix, {
      body: 'Initial post body',
      crisisFlag: false,
    });
    const updatedBody = 'Updated post body';
    const res = await PostClient.update(postOwner.accessToken, post.id, {
      body: updatedBody,
    });
    expect(res.status).toBe(200);

    const body = res.body as { id: string; body: string };
    expect(body).toHaveProperty('id', post.id);
    expect(body.body).toBe(updatedBody);
  });

  it('should return 401 if no token is provided', async () => {
    const { post } = await PostUseCase.createPost(prefix, {
      body: 'Initial post body',
      crisisFlag: false,
    });
    const res = await PostClient.update('', post.id, { body: 'New body' });
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const nonOwner = await UserFactory.create(prefix);
    const { post } = await PostUseCase.createPost(prefix, {
      body: 'Initial post body',
      crisisFlag: false,
    });
    const res = await PostClient.update(nonOwner.accessToken, post.id, {
      body: 'New body',
    });
    expect(res.status).toBe(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const user = await UserFactory.create(prefix);
    const res = await PostClient.update(user.accessToken, 'invalid-uuid', {
      body: 'New body',
    });
    expect(res.status).toBe(400);
  });

  it('should return 404 if post does not exist', async () => {
    const nonExistentPostId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await PostClient.update(user.accessToken, nonExistentPostId, {
      body: 'New body',
    });
    expect(res.status).toBe(404);
  });
});
