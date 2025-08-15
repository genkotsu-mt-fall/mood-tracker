import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * フォロー作成DTO
 * - フォローされるユーザIDのみを受け取る
 * - フォローする側（自分）のIDは認証情報から取得する
 */
export class CreateFollowDto {
  /**
   * フォローされる側のユーザID（相手）
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the user to be followed',
  })
  @IsNotEmpty()
  @IsUUID()
  followeeId!: string;
}
