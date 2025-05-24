import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { SecureUserRepository } from 'src/user/repository/secure/secure-user.repository';
import { CreateUserUseCase } from 'src/user/use-case/create-user.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly secureUserRepo: SecureUserRepository,
    private readonly useCase: CreateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto): Promise<UserEntity> {
    /**
     * 本番運用時にはここにメールアドレスの本人確認ロジックなど必要
     */
    return await this.useCase.execute(dto);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.secureUserRepo.findByEmailWithPassword(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.getHashedPassword());
    if (!isMatch) return null;

    return user.toUserEntity();
  }

  async login(user: UserEntity): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
