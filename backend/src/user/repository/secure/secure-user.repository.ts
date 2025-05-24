import { UserWithPasswordEntity } from 'src/user/entity/secure/user-with-password.entity';

export abstract class SecureUserRepository {
  abstract findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordEntity | null>;
}
