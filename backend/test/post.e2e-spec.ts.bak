import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from './utils/setup-e2e-app';
import {
  createUniqueUser,
  setToken,
  signupAndLogin,
} from './utils/auth-helper';
import * as request from 'supertest';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let postId: string;
  let ownerToken: string;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /post - should create a post', async () => {
    const owner = createUniqueUser('create');
    ownerToken = await signupAndLogin(app, owner);

    const res = await request(app.getHttpServer())
      .post('/post')
      .set(setToken(ownerToken))
      .send({
        mood: 'hidden',
        intensity: 0,
        body: 'Will be deleted',
        emoji: '🚫',
        followersOnly: false,
        followBackOnly: false,
        crisisFlag: false,
      })
      .expect(201);

    const body = res.body as { id: string };
    expect(body).toHaveProperty('id');
    postId = body.id;
  });

  /**
   * GETエンドポイントに関するE2Eテストは将来的に実装予定です。
   * 今後、フォロー関係や privacyJson の設定によって
   * 投稿の閲覧可否ロジックが複雑になるため、
   * 閲覧権限の仕様が固まってからテストを追加します。
   */

  it('PUT /post/:id - should update the post (by owner)', async () => {
    const req = await request(app.getHttpServer())
      .put(`/post/${postId}`)
      .set(setToken(ownerToken))
      .send({
        body: 'Will be deleted (updated by owner)',
      })
      .expect(200);

    const reqPostData = req.body as { body: string };
    expect(reqPostData.body).toBe('Will be deleted (updated by owner)');
  });

  it('PUT /post/:id - should fail to update the post (not owner)', async () => {
    const other = createUniqueUser('put');
    const otherToken = await signupAndLogin(app, other);

    await request(app.getHttpServer())
      .put(`/post/${postId}`)
      .set(setToken(otherToken))
      .send({
        body: 'Will be deleted (updated by not owner)',
      })
      .expect(403);
  });

  it('DELETE /post/:id - should fail to delete the post (not owner)', async () => {
    const other = createUniqueUser('delete');
    const otherToken = await signupAndLogin(app, other);

    await request(app.getHttpServer())
      .delete(`/post/${postId}`)
      .set(setToken(otherToken))
      .expect(403);
  });

  it('DELETE /post/:id - should delete the post (by owner)', async () => {
    await request(app.getHttpServer())
      .delete(`/post/${postId}`)
      .set(setToken(ownerToken))
      .expect(200);
  });

  it('GET /post/:id - should return 404 for deleted post', async () => {
    await request(app.getHttpServer())
      .get(`/post/${postId}`)
      .set(setToken(ownerToken))
      .expect(404);
  });
});
