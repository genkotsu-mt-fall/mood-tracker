import { GroupResponseDto } from 'src/group/dto/group_response.dto';
import { AppBootstrapper } from '../../test/bootstrap/app-bootstrapper';
import { GroupUseCase } from '../../test/usecases/group.usecase';
import { GroupClient } from '../../test/clients/group.client';

describe('GroupController', () => {
  const prefix = 'group_get';
  const groupName = 'test group';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  describe('GroupController (GET /group)', () => {
    it('should return paginated list of groups', async () => {
      const { groupOwner } = await GroupUseCase.createGroup(prefix);
      await GroupClient.create(groupOwner.accessToken, groupName);
      await GroupClient.create(groupOwner.accessToken, groupName);

      const page = 1;
      const limit = 2;

      const res = await GroupClient.getAll(groupOwner.accessToken, page, limit);
      expect(res.status).toBe(200);

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
      const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
      const res = await GroupClient.get(groupOwner.accessToken, group.id);
      expect(res.status).toBe(200);

      const body = res.body as { id: string; name: string; userId: string };
      expect(body.id).toBe(group.id);
      expect(body.name).toBe(group.name);
      expect(body.userId).toBe(groupOwner.profile.id);
    });

    it('should return 401 if no token is provided', async () => {
      const { group } = await GroupUseCase.createGroup(prefix);
      const res = await GroupClient.get('', group.id);
      expect(res.status).toBe(401);
    });

    it('should return 400 if id is not UUID', async () => {
      const { groupOwner } = await GroupUseCase.createGroup(prefix);
      const res = await GroupClient.get(groupOwner.accessToken, 'invalid-uuid');
      expect(res.status).toBe(400);
    });

    it('should return 404 if group is not found', async () => {
      const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const { groupOwner } = await GroupUseCase.createGroup(prefix);
      const res = await GroupClient.get(
        groupOwner.accessToken,
        nonExistentGroupId,
      );
      expect(res.status).toBe(404);
    });
  });
});
