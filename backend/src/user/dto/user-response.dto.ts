import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UserResponseDto {
  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
  }

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name?: string;
}
