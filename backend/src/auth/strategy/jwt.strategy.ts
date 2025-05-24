import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    /**
     * `configService.get()` は通常 `string | undefined` を返すが、
     * AppModule で Zod によるスキーマバリデーションを行っており、
     * JWT_SECRET が必ず存在する前提でアプリが起動しているため、
     * ここでは `!` を使って undefined の可能性を明示的に除外している。
     *
     * `!` is used here to assert that JWT_SECRET is defined.
     * This is safe because AppModule uses Zod schema validation at boot time,
     * and the application will not start if JWT_SECRET is missing.
     *
     * please read more backend/src/app.module.ts
     */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const userId = payload.sub;
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException(`無効なユーザです`);
    }
    return user;
  }
}
