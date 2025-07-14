import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create_group.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  @IsNotEmpty()
  name?: string;
}
