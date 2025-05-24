import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUserRepository } from 'src/user/repository/prisma-user.repository';
import { CreateUserUseCase } from 'src/user/use-case/create-user.use-case';
import { UserRepository } from 'src/user/repository/user.repository';
import { SecureUserRepository } from 'src/user/repository/secure/secure-user.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    PrismaService,
    PrismaUserRepository,
    CreateUserUseCase,
    {
      provide: UserRepository,
      useExisting: PrismaUserRepository,
    },
    {
      provide: SecureUserRepository,
      useExisting: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
