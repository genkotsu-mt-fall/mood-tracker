import {
  Body,
  Controller,
  Get,
  Post,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.service.signup(dto);
    return new UserResponseDto(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: UserEntity }) {
    return this.service.login(req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserEntity): UserResponseDto {
    return new UserResponseDto(user);
  }
}
