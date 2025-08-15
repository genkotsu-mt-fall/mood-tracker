import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create_group.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({
    example: 'Study Group',
    description: 'The name of the group',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;
}
