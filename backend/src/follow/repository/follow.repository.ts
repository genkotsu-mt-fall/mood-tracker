import { UserEntity } from 'src/user/entity/user.entity';
import { CreateFollowDto } from '../dto/create_follow.dto';
// import { UpdateFollowDto } from '../dto/update_follow.dto';
import { FollowEntity } from '../entity/follow.entity';

export abstract class FollowRepository {
  abstract create(userId: string, dto: CreateFollowDto): Promise<FollowEntity>;

  // abstract findAllWithCount(pagination: {
  //   skip: number;
  //   take: number;
  // }): Promise<{ data: FollowEntity[]; total: number }>;

  abstract findById(id: string): Promise<FollowEntity | null>;

  abstract findFollowRelation(
    userId: string,
    followeeId: string,
  ): Promise<FollowEntity | null>;

  /**
   * 通常の運用では使用しない（フォローは作成・削除のみ想定）。
   *
   * ただし今後、ブロック機能などにより、
   * フォロー関係を「削除」ではなく「無効化（status変更）」で扱いたい場合に備えて定義。
   *
   * 例：status: 'active' | 'blocked'
   */
  // abstract update(id: string, data: UpdateFollowDto): Promise<FollowEntity>;

  abstract delete(id: string): Promise<void>;

  abstract findFollowersByUserId(userId: string): Promise<UserEntity[]>;

  abstract findFollowingByUserId(userId: string): Promise<UserEntity[]>;
}
