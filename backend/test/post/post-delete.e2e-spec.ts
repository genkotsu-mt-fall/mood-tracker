import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { PostClient } from 'test/clients/post.client';
import { UserFactory } from 'test/factories/user.factory';
import { PostUseCase } from 'test/usecases/post.usecase';

describe('PostController (DELETE /post/:id)', () => {
  const prefix = 'post_delete';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should delete the post if user is owner', async () => {
    const { post, postOwner } = await PostUseCase.createPost(prefix, {
      body: 'Test post',
      crisisFlag: false,
    });
    const deleteResponse = await PostClient.delete(
      postOwner.accessToken,
      post.id,
    );
    expect(deleteResponse.status).toBe(200);

    const nonExistentPost = await PostClient.get(
      postOwner.accessToken,
      post.id,
    );
    expect(nonExistentPost.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const { post } = await PostUseCase.createPost(prefix, {
      body: 'Test post',
      crisisFlag: false,
    });
    const res = await PostClient.delete('', post.id);
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const nonOwner = await UserFactory.create(prefix);
    const { post } = await PostUseCase.createPost(prefix, {
      body: 'Test post',
      crisisFlag: false,
    });
    const res = await PostClient.delete(nonOwner.accessToken, post.id);
    expect(res.status).toBe(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const { postOwner } = await PostUseCase.createPost(prefix, {
      body: 'Test post',
      crisisFlag: false,
    });
    const res = await PostClient.delete(postOwner.accessToken, 'invalid-uuid');
    expect(res.status).toBe(400);
  });

  it('should return 404 if group does not exist', async () => {
    const nonExistentPostId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await PostClient.delete(user.accessToken, nonExistentPostId);
    expect(res.status).toBe(404);
  });
});
