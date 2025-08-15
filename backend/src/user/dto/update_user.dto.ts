// import { OmitType, PartialType } from '@nestjs/mapped-types';
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create_user.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
] as const) {}
