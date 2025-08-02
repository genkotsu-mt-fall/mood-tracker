import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { PrismaUserRepository } from './repository/prisma-user.repository';
import { UserRepository } from './repository/user.repository';
import { FindUserByIdUseCase } from './use-case/find-user-by-id.use-case';
import { UpdateUserUseCase } from './use-case/update-user.use-case';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [UserController],
  exports: [CreateUserUseCase, FindUserByIdUseCase, UpdateUserUseCase],
})
export class UserModule {}
