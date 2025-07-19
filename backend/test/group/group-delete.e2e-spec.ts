import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupUseCase } from 'test/usecases/group.usecase';
import { GroupClient } from 'test/clients/group.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupController (DELETE /group/:id)', () => {
  const prefix = 'group_delete';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should delete the group if user is owner', async () => {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    const deleteResponse = await GroupClient.delete(
      groupOwner.accessToken,
      group.id,
    );
    expect(deleteResponse.status).toBe(200);

    const nonExistentGroup = await GroupClient.get(
      groupOwner.accessToken,
      group.id,
    );
    expect(nonExistentGroup.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const { group } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.delete('', group.id);
    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not the owner', async () => {
    const nonOwner = await UserFactory.create(prefix);
    const { group } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.delete(nonOwner.accessToken, group.id);
    expect(res.status).toBe(403);
  });

  it('should return 400 if id is not UUID', async () => {
    const { groupOwner } = await GroupUseCase.createGroup(prefix);
    const res = await GroupClient.delete(
      groupOwner.accessToken,
      'invalid-uuid',
    );
    expect(res.status).toBe(400);
  });

  it('should return 404 if group does not exist', async () => {
    const nonExistentGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const user = await UserFactory.create(prefix);
    const res = await GroupClient.delete(user.accessToken, nonExistentGroupId);
    expect(res.status).toBe(404);
  });
});
