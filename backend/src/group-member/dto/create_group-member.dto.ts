import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGroupMemberDto {
  @IsNotEmpty()
  @IsUUID()
  groupId!: string;

  @IsNotEmpty()
  @IsUUID()
  memberId!: string;
}
