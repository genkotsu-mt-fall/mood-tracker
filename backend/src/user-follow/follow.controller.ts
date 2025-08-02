import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateFollowDto } from 'src/follow/dto/create_follow.dto';
import { FollowResponseDto } from 'src/follow/dto/follow_response.dto';
import { CreateFollowUseCase } from './use-case/create-follow.use-case';

@Controller('follow')
export class FollowController {
  constructor(private readonly createFollowUseCase: CreateFollowUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateFollowDto,
  ): Promise<FollowResponseDto> {
    const result = await this.createFollowUseCase.execute(req.user.id, dto);
    return new FollowResponseDto(result);
  }
}
