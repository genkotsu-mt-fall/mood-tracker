import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createGroup } from '../../test/utils/group-helper';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';
import { GroupResponseDto } from 'src/group/dto/group_response.dto';

describe('GroupController', () => {
  let app: INestApplication;
  const prefix = 'group_get';
  const groupName = 'test group';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GroupController (GET /group)', () => {
    it('should return paginated list of groups', async () => {
      const { groupOwnerToken } = await createGroup(prefix, app, groupName);
      await createGroup(prefix, app, groupName);

      const limit = 2;
      const res = await request(app.getHttpServer())
        .get('/group')
        .set(setToken(groupOwnerToken))
        .query({ page: 1, limit })
        .expect(200);

      const body = res.body as {
        data: GroupResponseDto[];
        total: number;
        hasNextPage: boolean;
      };
      expect(body.hasNextPage).toBe(true);
      expect(body.total).toBeGreaterThanOrEqual(limit);
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('name');
      expect(body.data[0]).toHaveProperty('userId');
    });
  });

  describe('GroupController (GET /group/:id)', () => {
    it('should return a specific group with auth', async () => {
      const { groupRes, groupOwnerToken, groupOwnerId } = await createGroup(
        prefix,
        app,
        groupName,
      );
      const groupId = groupRes.id;

      const res = await request(app.getHttpServer())
        .get(`/group/${groupId}`)
        .set(setToken(groupOwnerToken))
        .expect(200);

      const body = res.body as { id: string; name: string; userId: string };
      expect(body.id).toBe(groupId);
      expect(body.name).toBe('test group');
      expect(body.userId).toBe(groupOwnerId);
    });

    it('should return 401 if no token is provided', async () => {
      const { groupRes } = await createGroup(prefix, app, groupName);
      const groupId = groupRes.id;

      await request(app.getHttpServer()).get(`/group/${groupId}`).expect(401);
    });

    it('should return 400 if id is not UUID', async () => {
      const invalidGroupId = 'invalid-uuid';
      const { token } = await createAndLoginUser(prefix, app);
      await request(app.getHttpServer())
        .get(`/group/${invalidGroupId}`)
        .set(setToken(token))
        .expect(400);
    });

    it('should return 404 if group is not found', async () => {
      const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const { token } = await createAndLoginUser(prefix, app);
      await request(app.getHttpServer())
        .get(`/group/${nonExistentGroupId}`)
        .set(setToken(token))
        .expect(404);
    });
  });
});
