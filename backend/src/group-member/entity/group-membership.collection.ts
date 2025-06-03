import { GroupMembershipEntity } from './group-membership.entity';

/**
 * GroupMembershipCollection は、ユーザーのグループ所属情報を保持・評価するためのコレクションです。
 *
 * ## 目的
 * - 特定のユーザーが「どのグループに所属しているか」を表現します。
 * - ビュー制御（閲覧可否）や権限制御などで、「どのグループに属しているか」をもとに条件判定を行います。
 *
 * ## 主な機能
 * - `belongsAll(requiredGroupIds)`:
 *   - 引数で指定されたグループ ID 全てに所属しているかを判定。
 *   - AND 条件（すべて所属している必要がある）に相当。
 * - `belongsAny(requiredGroupIds)`:
 *   - 引数のうちいずれかのグループ ID に所属していれば true を返す。
 *   - OR 条件（1つでも所属していればよい）に相当。
 *
 * ## 補足
 * - `fromPrimitives()` により、プリミティブな group_id/member_id の配列から生成可能です。
 * - 内部的には `GroupMembershipEntity[]` を保持し、責務を明確に分離しています。
 */
export class GroupMembershipCollection {
  constructor(private readonly items: GroupMembershipEntity[]) {}

  static fromPrimitives(
    data: {
      group_id: string;
      member_id: string;
    }[],
  ): GroupMembershipCollection {
    return new GroupMembershipCollection(
      data.map((d) => new GroupMembershipEntity(d.group_id, d.member_id)),
    );
  }

  private groupIds(): string[] {
    return this.items.map((item) => item.groupId);
  }

  belongsAll(requiredGroupIds: string[]): boolean {
    const belongingGroupIds = this.groupIds();
    return requiredGroupIds.every((id) => belongingGroupIds.includes(id));
  }

  belongsAny(requiredGroupIds: string[]): boolean {
    const belongingGroupIds = this.groupIds();
    return requiredGroupIds.some((id) => belongingGroupIds.includes(id));
  }
}
