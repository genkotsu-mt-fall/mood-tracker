import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import { FindUserByIdUseCase } from '../use-case/find-user-by-id.use-case';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response';
import { ApiEndpoint } from 'src/common/swagger/endpoint.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

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
