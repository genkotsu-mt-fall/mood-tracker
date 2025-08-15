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
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';

@Controller('group')
export class GroupController {
  constructor(
    private readonly findGroupMembersUseCase: FindGroupMembersUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/members')
  @ApiEndpoint({
    summary: 'Find members of a group',
    description:
      'This endpoint retrieves all members of a specific group by its ID.',
    response: {
      type: UserResponseDto,
      description: 'Group members retrieved successfully',
      isArray: true,
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Group' },
    errors: { unauthorized: true },
  })
  async findMembers(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const result = await this.findGroupMembersUseCase.execute(id);
    return {
      success: true,
      data: result.map((item) => new UserResponseDto(item)),
    };
  }
}
