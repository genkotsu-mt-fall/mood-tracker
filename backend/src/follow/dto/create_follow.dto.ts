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
  @IsNotEmpty()
  @IsUUID()
  followeeId!: string;
}
