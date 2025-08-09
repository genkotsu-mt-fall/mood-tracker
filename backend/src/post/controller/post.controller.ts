import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
import { CreatePostUseCase } from '../use-case/create-post.use-case';
import { UpdatePostUseCase } from '../use-case/update-post.use-case';
import { DeletePostUseCase } from '../use-case/delete-post.use-case';
import { PostResponseDto } from '../dto/post_response.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { PostOwnerGuard } from '../guard/post-owner.guard';

@Controller('post')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const result = await this.createPostUseCase.execute(user.id, dto);
    return new PostResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Put(':id')
  async update(
    @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const result = await this.updatePostUseCase.execute(id, user.id, dto);
    return new PostResponseDto(result);
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Delete(':id')
  async remove(
    @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    await this.deletePostUseCase.execute(id, user.id);
    return { message: 'Post deleted successfully' };
  }
}
