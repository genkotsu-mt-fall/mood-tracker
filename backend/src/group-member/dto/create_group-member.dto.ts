import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGroupMemberDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the group',
  })
  @IsNotEmpty()
  @IsUUID()
  groupId!: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'The ID of the user who is being added to the group',
  })
  @IsNotEmpty()
  @IsUUID()
  memberId!: string;
}
