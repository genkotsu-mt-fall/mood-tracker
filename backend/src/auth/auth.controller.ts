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
