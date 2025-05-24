import { User as PrismaUser } from '@prisma/client';
import { UserWithPasswordEntity } from 'src/user/entity/secure/user-with-password.entity';

export function toUserWithPasswordEntity(
  secureUser: PrismaUser,
): UserWithPasswordEntity {
  return new UserWithPasswordEntity(
    secureUser.hashedPassword,
    secureUser.id,
    secureUser.email,
    secureUser.name ?? undefined,
  );
}
