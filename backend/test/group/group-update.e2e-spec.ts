import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupUseCase } from 'test/usecases/group.usecase';
import { GroupClient } from 'test/clients/group.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupController (PUT /group/:id)', () => {
  const prefix = 'group_update';
  const updatedGroupName = 'updated test group';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should update the group name if user is owner', async () => {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.update(
      groupOwner.accessToken,
      group.id,
      updatedGroupName,
    );
    expect(res.status).toBe(200);

    const body = res.body as { id: string; name: string };
    expect(body).toHaveProperty('id', group.id);
    expect(body.name).toBe('updated test group');
  });

  it('should return 401 if no token is provided', async () => {
    const { group } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.update('', group.id, updatedGroupName);
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const nonOwner = await UserFactory.create(prefix);
    const { group } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.update(
      nonOwner.accessToken,
      group.id,
      updatedGroupName,
    );
    expect(res.status).toBe(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const user = await UserFactory.create(prefix);
    const res = await GroupClient.update(
      user.accessToken,
      'invalid-uuid',
      updatedGroupName,
    );
    expect(res.status).toBe(400);
  });

  it('should return 404 if group does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await GroupClient.update(
      user.accessToken,
      nonExistentGroupId,
      updatedGroupName,
    );
    expect(res.status).toBe(404);
  });

  it('should not update a group without name', async () => {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.update(groupOwner.accessToken, group.id, '');
    expect(res.status).toBe(400);
  });
});
