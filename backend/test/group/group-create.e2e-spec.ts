import { AppBootstrapper } from 'test/bootstrap/app-bootstrapper';
import { GroupUseCase } from 'test/usecases/group.usecase';
import { GroupClient } from 'test/clients/group.client';
import { UserFactory } from 'test/factories/user.factory';

describe('GroupController (POST /group)', () => {
  const prefix = 'group_create';

  beforeAll(async () => {
    await AppBootstrapper.init();
  });

  afterAll(async () => {
    await AppBootstrapper.shutdown();
  });

  it('should create a group', async () => {
    const { group, groupOwner } = await GroupUseCase.createGroup(prefix);
    expect(group).toHaveProperty('id');
    expect(group).toHaveProperty('userId', groupOwner.profile.id);
  });

  it('should reject unauthenticated group creation', async () => {
    const res = await GroupClient.create('', prefix);
    expect(res.status).toBe(401);
  });

  it('should not allow creating a group without a name', async () => {
    const user = await UserFactory.create(prefix);
    const res = await GroupClient.create(user.accessToken, undefined);
    expect(res.status).toBe(400);
  });

  it('should allow different users to use the same group name', async () => {
    const userA = await UserFactory.create(prefix);
    const userB = await UserFactory.create(prefix);
    const groupName = `${prefix}_test`;
    const groupAResponse = await GroupClient.create(
      userA.accessToken,
      groupName,
    );
    const groupBResponse = await GroupClient.create(
      userB.accessToken,
      groupName,
    );
    expect(groupAResponse.status).toBe(201);
    expect(groupBResponse.status).toBe(201);
  });

  // it('should reject group name with only whitespace', async () => {
  // const { token } = await createAndLoginUser(prefix, app);
  // const name = ' ';

  // await request(app.getHttpServer())
  //     .post('/group')
  //     .set(setToken(token))
  //     .send({ name })
  //     .expect(400);
  // });

  // it('should not allow creating a group with a duplicate name for the same user', async () => {});

  // it('should reject group name exceeding max length', async () => {});

  // it('should allow group name with special characters or emoji', async () => {});

  // it('should handle group behavior after user is deleted', async () => {});
});
