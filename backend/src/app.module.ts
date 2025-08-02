import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { FollowModule } from './follow/follow.module';
import { UserFollowModule } from './user-follow/user-follow.module';
import { UserGroupModule } from './user-group/user-group.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PostModule,
    FollowModule,
    GroupModule,
    GroupMemberModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error('環境変数のバリデーションチェックに失敗しました。');
        }
        return parsed.data;
      },
    }),
    UserFollowModule,
    UserGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
