import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from '../../test/utils/setup-e2e-app';
import { createAndLoginUser, setToken } from '../../test/utils/auth-helper';
import { createGroup } from '../../test/utils/group-helper';

describe('GroupController (POST /group)', () => {
  let app: INestApplication;
  const prefix = 'group_create';

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a group', async () => {
    const { groupRes, groupOwnerId } = await createGroup(prefix, app, 'test');

    expect(groupRes).toHaveProperty('id');
    expect(groupRes.userId).toBe(groupOwnerId);
  });

  it('should reject unauthenticated group creation', async () => {
    await request(app.getHttpServer())
      .post('/group')
      .send({ name: 'unauthenticated group' })
      .expect(401);
  });

  it('should not allow creating a group without a name', async () => {
    const { token } = await createAndLoginUser(prefix, app);
    const name = undefined;

    await request(app.getHttpServer())
      .post('/group')
      .set(setToken(token))
      .send({ name })
      .expect(400);
  });

  it('should allow different users to use the same group name', async () => {
    await createGroup(prefix, app, 'same group name');
    await createGroup(prefix, app, 'same group name');
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
