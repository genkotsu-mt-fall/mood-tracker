import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from '../entity/group.entity';

export class GroupResponseDto {
  constructor(entity: GroupEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the group',
  })
  id: string;

  @ApiProperty({
    example: 'Study Group',
    description: 'The name of the group',
  })
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'The ID of the user who created the group',
  })
  userId: string;

  @ApiProperty({
    example: '2023-03-15T12:00:00Z',
    description: 'The date and time when the group was created',
  })
  createdAt: Date;
}
