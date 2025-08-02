import {
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FindFollowByIdUseCase } from '../use-case/find-follow-by-id.use-case';
import { DeleteFollowUseCase } from '../use-case/delete-follow.use-case';
import { FollowResponseDto } from '../dto/follow_response.dto';
import { FollowOwnerGuard } from '../guard/follow-owner.guard';

@Controller('follow')
export class FollowController {
  constructor(
    private readonly findFollowByIdUseCase: FindFollowByIdUseCase,
    private readonly deleteFollowUseCase: DeleteFollowUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<FollowResponseDto> {
    const result = await this.findFollowByIdUseCase.execute(id);
    return new FollowResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, FollowOwnerGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deleteFollowUseCase.execute(id);
    return { message: 'Follow deleted successfully' };
  }
}
