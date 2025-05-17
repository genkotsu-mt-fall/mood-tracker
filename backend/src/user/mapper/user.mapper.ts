import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../entity/user.entity';

export function toUserEntity(user: PrismaUser) {
  return new UserEntity(user.id, user.email, user.name ?? undefined);
}
