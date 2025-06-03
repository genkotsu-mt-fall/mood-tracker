export class GroupMembershipEntity {
  constructor(
    public readonly groupId: string,
    public readonly memberId: string,
  ) {}
}
