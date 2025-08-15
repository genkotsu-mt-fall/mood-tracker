import { GroupClient } from 'test/clients/group.client';
import { UserFactory } from 'test/factories/user.factory';
import { ApiResponse, SupertestResponse } from 'test/types/api';

export type SupertestGroupResponse = SupertestResponse<
  ApiResponse<{ id: string; name: string; userId: string }>
>;

export class GroupUseCase {
  /**
   * グループ名を明示的に使用して作成
   */
  static async createGroupWithName(prefix: string, groupName?: string) {
    const groupOwner = await UserFactory.create(`${prefix}_groupOwner`);
    const res: SupertestGroupResponse = await GroupClient.create(
      groupOwner.accessToken,
      groupName,
    );

    expect(res.status).toBe(201);

    const group = res.body.data;
    return {
      group,
      groupOwner,
    };
  }

  /**
   * グループ名を自動生成して作成
   */
  static async createGroup(prefix: string) {
    const groupName = `${prefix}_${Date.now()}`;
    return await this.createGroupWithName(prefix, groupName);
  }
}
