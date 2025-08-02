import { Controller, UseGuards, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GroupEntity } from 'src/group/entity/group.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindOwnedGroupsUseCase } from './use-case/find-owned-groups.usecase';

@Controller('auth')
export class UserGroupController {
  constructor(
    private readonly findOwnedGroupsUseCase: FindOwnedGroupsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/groups')
  async getOwnedGroups(
    @CurrentUser() user: UserEntity,
  ): Promise<GroupEntity[]> {
    return await this.findOwnedGroupsUseCase.execute(user.id);
  }
}
