import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import { FindUserByIdUseCase } from '../use-case/find-user-by-id.use-case';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.findUserByIdUseCase.execute(id);
    return new UserResponseDto(user);
  }
}
