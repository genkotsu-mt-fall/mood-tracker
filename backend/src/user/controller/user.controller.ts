import {
  // Body,
  Controller,
  // Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  // Post,
  // Put,
  // Query,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
// import { CreateUserDto } from '../dto/create_user.dto';
// import { UpdateUserDto } from '../dto/update_user.dto';
// import { CreateUserUseCase } from '../use-case/create-user.use-case';
import { UserResponseDto } from '../dto/user-response.dto';
// import { UserEntity } from '../entity/user.entity';
// import { FindAllUserUseCase } from '../use-case/find-all-users.use-case';
import { FindUserByIdUseCase } from '../use-case/find-user-by-id.use-case';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
// import { UpdateUserUseCase } from '../use-case/update-user.use-case';
// import { DeleteUserUseCase } from '../use-case/delete-user.use-case';
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
// import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';

@Controller('user')
export class UserController {
  constructor(
    // private readonly createUserUseCase: CreateUserUseCase,
    // private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    // private readonly updateUserUseCase: UpdateUserUseCase,
    // private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  // @Post()
  // async create(@Body() userData: CreateUserDto) {
  //   const user: UserEntity = await this.createUserUseCase.execute(userData);
  //   return new UserResponseDto(user);
  // }

  // @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async findAll(@Query() query: PaginationQueryDto) {
  //   const { page, limit } = query;
  //   const result = await this.findAllUserUseCase.execute({ page, limit });

  //   return new PaginatedResponseDto<UserResponseDto>({
  //     data: result.data.map((user) => new UserResponseDto(user)),
  //     total: result.total,
  //     page: result.page,
  //     limit: result.limit,
  //     hasNextPage: result.hasNextPage,
  //   });
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.findUserByIdUseCase.execute(id);
    return new UserResponseDto(user);
  }

  // @Put(':id')
  // async update(
  //   @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  //   @Body() userData: UpdateUserDto,
  // ) {
  //   const user = await this.updateUserUseCase.execute(id, userData);
  //   return new UserResponseDto(user);
  // }

  // @Delete(':id')
  // async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
  //   await this.deleteUserUseCase.execute(id);
  //   return { message: 'User deleted successfully' };
  // }
}
