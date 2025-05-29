export class GroupMemberEntity {
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
  ) {}
}
