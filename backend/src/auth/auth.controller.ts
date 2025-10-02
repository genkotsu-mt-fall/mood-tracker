import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  @ApiEndpoint({
    summary: 'User signup',
    description: 'Allows a new user to create an account',
    body: CreateUserDto,
    response: {
      type: UserResponseDto,
      kind: ResponseKind.Created,
      description: 'User successfully created',
    },
    errors: {
      badRequest: {
        // 例の上書きは任意。省略すればデフォルト例と説明が入る
        description: 'Bad request (validation or email already exists)',
      },
    },
  })
  async signup(
    @Body() dto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.service.signup(dto);
    return { success: true, data: new UserResponseDto(user) };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiEndpoint({
    summary: 'User login',
    description:
      'Authenticates the user with email and password and returns an access token.',
    body: LoginDto,
    response: {
      type: LoginResponseDto,
      description: 'Login succeeded and an access token was issued.',
    },
    errors: {
      unauthorized: true,
    },
  })
  async login(
    @Request() req: { user: UserEntity },
  ): Promise<ApiResponse<LoginResponseDto>> {
    const { accessToken } = await this.service.login(req.user);
    return { success: true, data: { accessToken } };
  }

  // ------------------------------------------------------------
  // [GET /auth/me] リクエスト〜レスポンスの流れ（覚え書き）
  //
  // 1) Next.js（サーバー側）
  //    - requireUser() 等で cookies().get('_access') からトークン取得
  //    - Authorization: Bearer <token> を付けて GET /auth/me を発行
  //    - ※ バックエンドは「クッキー」は見ない。Authorization ヘッダーのみを見る
  //
  // 2) NestJS ルーティング
  //    - @UseGuards(JwtAuthGuard) により、ハンドラ到達前にガードが実行
  //    - JwtAuthGuard -> Passport の 'jwt' ストラテジーが起動
  //
  // 3) JwtStrategy（passport-jwt）
  //    - ExtractJwt.fromAuthHeaderAsBearerToken() でトークンを抽出
  //    - JWT_SECRET で署名検証 / ignoreExpiration:false で exp も検証
  //
  // 4) JwtStrategy.validate(payload)
  //    - payload.sub（= userId）で UserRepository からユーザーを検索
  //    - 見つからなければ UnauthorizedException -> 401
  //    - 見つかれば UserEntity を返す → Passport が req.user にセット
  //
  // 5) コントローラ (@CurrentUser)
  //    - @CurrentUser() が req.user を受け取り、UserResponseDto に詰めて 200 を返す
  //
  // [失敗パターンと落ちどころ]
  // - Authorization ヘッダー欠如 / 形式不正 → ストラテジーで失敗 → 401
  // - 署名不正 / 期限切れ（exp）          → ストラテジーで失敗 → 401
  // - ユーザー不存在 / 無効                → validate() 内で Unauthorized → 401
  //
  // [運用メモ]
  // - フロントの Middleware は「_access クッキーがあるか」だけを軽く判定（Edge）
  // - 厳密検証は本エンドポイントで実施。Next 側は 401 を受けたらクッキーを消し /login へ
  // ------------------------------------------------------------
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiEndpoint({
    summary: 'Get current user',
    description: 'Returns the currently authenticated user details.',
    response: {
      type: UserResponseDto,
      description: 'Current user details retrieved successfully.',
    },
    auth: true,
    errors: {
      unauthorized: true,
    },
  })
  getCurrentUser(
    @CurrentUser() user: UserEntity,
  ): ApiResponse<UserResponseDto> {
    return { success: true, data: new UserResponseDto(user) };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiEndpoint({
    summary: 'Update current user',
    description: 'Updates the details of the currently authenticated user.',
    body: UpdateUserDto,
    response: {
      type: UserResponseDto,
      description: 'Current user details updated successfully.',
    },
    auth: true,
    errors: {
      unauthorized: true,
      notFound: true,
    },
  })
  async updateCurrentUser(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const updatedUser = await this.service.updateCurrentUser(user, dto);
    return { success: true, data: new UserResponseDto(updatedUser) };
  }
}
