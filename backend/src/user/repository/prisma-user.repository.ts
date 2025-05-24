import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserEntity } from '../entity/user.entity';
// import { CreateUserDto } from '../dto/create_user.dto';
import { Injectable } from '@nestjs/common';
import { toUserEntity } from '../mapper/user.mapper';
import { UpdateUserDto } from '../dto/update_user.dto';
import { CreateUserInput } from '../type/create-user-input.type';
import { SecureUserRepository } from './secure/secure-user.repository';
import { UserWithPasswordEntity } from '../entity/secure/user-with-password.entity';
import { toUserWithPasswordEntity } from '../mapper/secure/secure-user.mapper';

@Injectable()
export class PrismaUserRepository
  implements UserRepository, SecureUserRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toUserEntity(user) : null;
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return toUserEntity(user);
  }

  async findAllWithCount(pagenation: {
    skip: number;
    take: number;
  }): Promise<{ data: UserEntity[]; total: number }> {
    const { skip, take } = pagenation;
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map((user) => toUserEntity(user)),
      total,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toUserEntity(user) : null;
  }

  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return toUserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  /**Secure */
  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toUserWithPasswordEntity(user) : null;
  }
}
