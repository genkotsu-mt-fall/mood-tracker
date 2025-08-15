import { ApiProperty } from '@nestjs/swagger';
import { FollowEntity } from '../entity/follow.entity';

export class FollowResponseDto {
  constructor(entity: FollowEntity) {
    this.id = entity.id;
    this.followerId = entity.followerId;
    this.followeeId = entity.followeeId;
    this.followedAt = entity.followedAt;
  }

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the follow relationship',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'The ID of the user who follows another user',
  })
  followerId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'The ID of the user being followed',
  })
  followeeId: string;

  @ApiProperty({
    example: '2023-03-15T12:00:00Z',
    description: 'The date and time when the follow relationship was created',
  })
  followedAt: Date;
}
