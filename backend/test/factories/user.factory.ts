import { AuthClient, AuthUser } from 'test/clients/auth.client';
import { createUniqueUser } from 'test/utils/auth-helper';

export class UserFactory {
  static async create(prefix: string) {
    const user: AuthUser = createUniqueUser(prefix);
    return await AuthClient.registerAndLogin(user);
  }
}
