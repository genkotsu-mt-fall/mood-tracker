import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  /**
   * `@IsNotEmpty()` によって実行時に値が必ずセットされるため、
   * `!`（確定代入アサーション）を使い、初期化を省略しています。
   */
  @IsString()
  @IsNotEmpty()
  name!: string;
}
