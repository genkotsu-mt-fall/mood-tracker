export class GroupEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,

    /**
     * グループが作成された日時
     */
    public readonly createdAt: Date,

    /**
     * グループを作成したユーザのID(=グループの所有者)
     */
    public readonly userId: string,
  ) {}
}
