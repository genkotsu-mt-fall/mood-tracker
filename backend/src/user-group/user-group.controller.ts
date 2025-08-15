import { Controller, UseGuards, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindOwnedGroupsUseCase } from './use-case/find-owned-groups.usecase';
import { ApiResponse } from 'src/common/response/api-response';
import { GroupResponseDto } from 'src/group/dto/group_response.dto';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';

@Controller('auth')
export class UserGroupController {
  constructor(
    private readonly findOwnedGroupsUseCase: FindOwnedGroupsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/groups')
  @ApiEndpoint({
    summary: 'Get my groups',
    description: 'Retrieve all groups owned by the authenticated user.',
    response: {
      type: GroupResponseDto,
      description: 'Groups retrieved successfully',
      isArray: true,
    },
    auth: true,
    errors: { unauthorized: true },
  })
  async getOwnedGroups(
    @CurrentUser() user: UserEntity,
  ): Promise<ApiResponse<GroupResponseDto[]>> {
    const items = await this.findOwnedGroupsUseCase.execute(user.id);
    return {
      success: true,
      data: items.map((item) => new GroupResponseDto(item)),
    };
  }
}
