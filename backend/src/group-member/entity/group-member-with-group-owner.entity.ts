/**
 * GroupMemberWithGroupOwner は、GroupMember に加え、
 * 関連する Group の所有者（userId）を含む情報構造です。
 *
 * ## 設計方針
 * - GroupMemberEntity を拡張せず新たに定義しているのは、
 *   - 単一責任の原則（SRP）を守るため
 *   - 継承による結合を避けるため（疎結合・柔軟性重視）
 * - GroupMemberEntity に group? を追加する案もあったが、
 *   - オプショナルな構造が型安全性と可読性を損なう懸念があったため採用しなかった
 *
 * このクラスは Guard や権限チェック用途で使用されます。
 */
export class GroupMemberWithGroupOwnerEntity {
  constructor(
    public readonly id: string,

    /**
     * 所属しているグループのID
     */
    public readonly groupId: string,

    /**
     * 所属しているユーザのID（＝メンバーID）
     */
    public readonly memberId: string,

    /**
     * メンバーがこのグループに追加された日時
     */
    public readonly addedAt: Date,

    /**
     * このグループの所有者のユーザーID
     */
    public readonly groupOwnerId: string,
  ) {}
}
