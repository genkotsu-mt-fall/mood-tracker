import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { PostClient } from 'test/clients/post.client';
import { UserFactory } from 'test/factories/user.factory';
import { PostUseCase } from 'test/usecases/post.usecase';

describe('PostController', () => {
  const prefix = 'post_get';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  describe('GET /post', () => {
    it('should return paginated results with correct page and limit', async () => {
      const user = await UserFactory.create(`${prefix}_pagination`);
      for (let i = 0; i < 15; i++) {
        await PostUseCase.createPostWithToken(user.accessToken, prefix, {
          body: `Post ${i}`,
          crisisFlag: false,
        });
      }

      const res = await PostClient.getAll(user.accessToken, 1, 10);

      const body = res.body as {
        data: PostResponseDto[];
        page: number;
        limit: number;
        hasNextPage: boolean;
      };
      expect(res.status).toBe(200);
      expect(body.data.length).toBe(10);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(10);
      expect(body.hasNextPage).toBe(true);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await PostClient.getAll('', 1, 10);
      expect(res.status).toBe(401);
    });

    it('should return 400 when query parameters are invalid', async () => {
      const user = await UserFactory.create(prefix);
      const res = await PostClient.getAll(user.accessToken, -1, 10);
      expect(res.status).toBe(400);

      const res2 = await PostClient.getAll(user.accessToken, 1, -10);
      expect(res2.status).toBe(400);
    });
  });

  describe('GET /post/:id', () => {
    it('should return a specific post with auth', async () => {
      const { post, postOwner } = await PostUseCase.createPost(prefix, {
        body: 'Test post body',
        crisisFlag: false,
      });
      const res = await PostClient.get(postOwner.accessToken, post.id);
      expect(res.status).toBe(200);

      const body = res.body as { id: string; body: string; userId: string };
      expect(body.id).toBe(post.id);
      expect(body.body).toBe(post.body);
      expect(body.userId).toBe(postOwner.profile.id);
    });

    it('should return 401 if no token is provided', async () => {
      const { post } = await PostUseCase.createPost(prefix, {
        body: 'Test post body',
        crisisFlag: false,
      });
      const res = await PostClient.get('', post.id);
      expect(res.status).toBe(401);
    });

    it('should return 400 if id is not UUID', async () => {
      const user = await UserFactory.create(prefix);
      const res = await PostClient.get(user.accessToken, 'invalid-uuid');
      expect(res.status).toBe(400);
    });

    it('should return 404 if group is not found', async () => {
      const nonExistentPostId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const user = await UserFactory.create(prefix);
      const res = await PostClient.get(user.accessToken, nonExistentPostId);
      expect(res.status).toBe(404);
    });
  });
});
