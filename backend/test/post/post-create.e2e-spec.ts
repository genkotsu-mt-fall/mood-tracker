import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { PostClient } from 'test/clients/post.client';
import { UserFactory } from 'test/factories/user.factory';
import { PostUseCase } from 'test/usecases/post.usecase';

describe('PostController (POST /post)', () => {
  const prefix = 'post_create';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should create a post', async () => {
    const params = {
      body: `${prefix}_post_body`,
      crisisFlag: false,
      mood: 'happy',
      intensity: 5,
      emoji: '😊',
      privacyJson: {},
    };
    const { post } = await PostUseCase.createPost(prefix, params);
    expect(post).toHaveProperty('id');
    expect(post.body).toBe(params.body);
  });

  it('should reject unauthenticated post creation', async () => {
    const params = {
      body: `${prefix}_post_body`,
      crisisFlag: false,
    };
    const res = await PostClient.create('', params);
    expect(res.status).toBe(401);
  });

  it('should not allow creating a post without a body', async () => {
    const params = {
      body: '',
      crisisFlag: false,
    };
    const user = await UserFactory.create(prefix);
    const res = await PostClient.create(user.accessToken, params);
    expect(res.status).toBe(400);
  });
});
