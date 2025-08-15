import { ApiProperty } from '@nestjs/swagger';
import { GroupMemberEntity } from '../entity/group-member.entity';

export class GroupMemberResponseDto {
  constructor(entity: GroupMemberEntity) {
    this.id = entity.id;
    this.groupId = entity.groupId;
    this.memberId = entity.memberId;
    this.addedAt = entity.addedAt;
  }

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the group member',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the group to which the member belongs',
  })
  groupId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'The ID of the user who is a member of the group',
  })
  memberId: string;

  @ApiProperty({
    example: '2023-03-15T12:00:00Z',
    description: 'The date and time when the member was added to the group',
  })
  addedAt: Date;
}
