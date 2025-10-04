import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import { FindUserByIdUseCase } from '../use-case/find-user-by-id.use-case';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import {
  ApiResponse,
  PaginatedApiResponse,
} from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';
import { FindAllUserUseCase } from '../use-case/find-all-users.use-case';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiEndpoint({
    summary: 'List users',
    description: 'Fetch a list of users.',
    response: {
      type: UserResponseDto,
      isArray: true,
      description: 'Users retrieved successfully',
    },
    auth: true,
    errors: { unauthorized: true },
  })
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedApiResponse<UserResponseDto>> {
    const { page, limit } = query;
    const result = await this.findAllUserUseCase.execute({ page, limit });

    return {
      success: true,
      data: result.data.map((user) => new UserResponseDto(user)),
      meta: {
        page: result.page,
        total: result.total,
        pageSize: result.limit,
        hasNext: result.hasNextPage,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiEndpoint({
    summary: 'Get a user by ID',
    description: 'Fetch a single user by its unique identifier.',
    response: {
      type: UserResponseDto,
      description: 'User retrieved successfully',
    },
    auth: true,
    idParam: { id: true, idParamDescription: 'User' },
    errors: { unauthorized: true, notFound: true },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.findUserByIdUseCase.execute(id);
    return { success: true, data: new UserResponseDto(user) };
  }
}
