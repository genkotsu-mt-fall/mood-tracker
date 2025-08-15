import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { SecureUserRepository } from 'src/user/repository/secure/secure-user.repository';
import { CreateUserUseCase } from 'src/user/use-case/create-user.use-case';
import { UpdateUserUseCase } from 'src/user/use-case/update-user.use-case';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly secureUserRepo: SecureUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto): Promise<UserEntity> {
    /**
     * 本番運用時にはここにメールアドレスの本人確認ロジックなど必要
     */
    return await this.createUserUseCase.execute(dto);
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

  async login(user: UserEntity): Promise<LoginResponseDto> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async updateCurrentUser(
    user: UserEntity,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.updateUserUseCase.execute(user.id, dto);
  }
}
