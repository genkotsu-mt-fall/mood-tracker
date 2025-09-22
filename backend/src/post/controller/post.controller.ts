import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Logger,
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
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { ResponseKind } from 'src/common/swagger/types';
import { MessageDto } from 'src/common/dto/message.dto';

@Controller('post')
export class PostController {
  private readonly logger = new Logger(PostController.name); // ← 追加

  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiEndpoint({
    summary: 'Create a post',
    description: 'Create a new post for the current user.',
    body: CreatePostDto,
    response: {
      type: PostResponseDto,
      kind: ResponseKind.Created,
      description: 'Post created successfully',
    },
    auth: true,
    errors: {
      unauthorized: true,
      badRequest: true,
    },
  })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePostDto,
  ): Promise<ApiResponse<PostResponseDto>> {
    this.logger.debug(`CreatePostDto: ${JSON.stringify(dto)}`); // ← 置換（開発向けは debug が無難）
    this.logger.log(`User ${user.id} is creating a post`); // 任意：誰が叩いたかの情報

    const result = await this.createPostUseCase.execute(user.id, dto);
    return { success: true, data: new PostResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Put(':id')
  @ApiEndpoint({
    summary: 'Update a post',
    description: 'Update an existing post owned by the current user.',
    body: UpdatePostDto,
    response: {
      type: PostResponseDto,
      description: 'Post updated successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Post' },
    errors: {
      unauthorized: true,
      forbidden: true,
      notFound: true,
      badRequest: true,
    },
  })
  async update(
    @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<ApiResponse<PostResponseDto>> {
    const result = await this.updatePostUseCase.execute(id, user.id, dto);
    return { success: true, data: new PostResponseDto(result) };
  }

  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Delete(':id')
  @ApiEndpoint({
    summary: 'Delete a post',
    description: 'Delete an existing post owned by the current user.',
    response: {
      type: MessageDto,
      description: 'Post deleted successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'Post' },
    errors: {
      unauthorized: true,
      forbidden: true,
      notFound: true,
    },
  })
  async remove(
    @CurrentUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<MessageDto>> {
    await this.deletePostUseCase.execute(id, user.id);
    return { success: true, data: { message: 'Post deleted successfully' } };
  }
}
