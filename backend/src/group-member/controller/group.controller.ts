import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { FindGroupMembersUseCase } from '../use-case/find-group-members.usecase';

@Controller('group')
export class GroupController {
  constructor(
    private readonly findGroupMembersUseCase: FindGroupMembersUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/members')
  async findMembers(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto[]> {
    const result = await this.findGroupMembersUseCase.execute(id);
    return result.map((item) => new UserResponseDto(item));
  }
}
