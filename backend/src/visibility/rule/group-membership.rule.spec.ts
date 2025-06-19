import { GroupMemberRepository } from 'src/group-member/repository/group-member.repository';
import { VisibilityContext } from '../context/visibility-context';
import { GroupMembershipRule } from './group-membership.rule';
import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';
import { GroupMembershipCollection } from 'src/group-member/entity/group-membership.collection';

describe('GroupMembershipRule', () => {
  const createCtx = (
    setting: VisibilityContext['setting'],
  ): VisibilityContext => ({
    viewerId: memberId,
    postOwnerId: '',
    setting,
  });
  const groupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const otherGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
  const memberId = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';

  // モック不要
  describe('shouldEvaluate', () => {
    // allow_groups === undefined => false
    it('should return false if allow_groups is undefined', () => {
      expect(GroupMembershipRule.shouldEvaluate(createCtx({}))).toBe(false);
    });

    // allow_groups.length === 0 => false
    it('should return false if allow_groups is an empty array', () => {
      expect(
        GroupMembershipRule.shouldEvaluate(createCtx({ allow_groups: [] })),
      ).toBe(false);
    });

    // allow_groups.length !== 0 &&
    // group_visibility_mode === undefined => false
    it('should return false if allow_groups is set but group_visibility_mode is undefined', () => {
      expect(
        GroupMembershipRule.shouldEvaluate(
          createCtx({ allow_groups: [groupId] }),
        ),
      ).toBe(false);
    });

    // allow_groups.length !== 0 &&
    // group_visibility_mode === 'none' => false
    it('should return false if group_visibility_mode is an invalid value', () => {
      expect(
        GroupMembershipRule.shouldEvaluate(
          createCtx({
            allow_groups: [groupId],
            group_visibility_mode: 'none' as unknown as undefined, //zod 側でテストの方がいいかも
          }),
        ),
      ).toBe(false);
    });

    // allow_groups.length !== 0 &&
    // group_visibility_mode === 'all' => true
    it('should return true if allow_groups and group_visibility_mode "all" are set', () => {
      expect(
        GroupMembershipRule.shouldEvaluate(
          createCtx({ allow_groups: [groupId], group_visibility_mode: 'all' }),
        ),
      ).toBe(true);
    });

    // allow_groups.length !== 0 &&
    // group_visibility_mode === 'any' => true
    it('should return true if allow_groups and group_visibility_mode "any" are set', () => {
      expect(
        GroupMembershipRule.shouldEvaluate(
          createCtx({ allow_groups: [groupId], group_visibility_mode: 'any' }),
        ),
      ).toBe(true);
    });
  });

  // モック必要
  describe('evaluate', () => {
    // GroupMembershipCollection のモック?
    let repository: jest.Mocked<GroupMemberRepository>;
    let usecase: FindGroupIdsByMemberIdUseCase;
    let rule: GroupMembershipRule;

    beforeEach(() => {
      repository = {
        create: jest.fn(),
        findAllWithCount: jest.fn(),
        findById: jest.fn(),
        findGroupIdsByMemberId: jest.fn(), //テストで使用
        loadWithGroupOwnerById: jest.fn(),
        delete: jest.fn(),
      };
      usecase = new FindGroupIdsByMemberIdUseCase(repository);
      rule = new GroupMembershipRule(usecase);
    });

    // usecase.execute() === null => false
    it('should return false if viewer has no group memberships', async () => {
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(null);
      expect(await rule.evaluate(createCtx({}))).toBe(false);
    });

    /**
     * 以下は GroupMembershipRule と GroupMembershipCollection の結合テストになっている。
     * 現時点では Collection のロジックが単純なため直接的にテストしているが、
     * 将来的に Collection のロジックが複雑になる場合は、
     * GroupMembershipCollection 自体をモック化してテスト対象の関心を分離すべき。
     *
     * → 「Rule が正しく Collection を呼び出しているか」だけを検証する単体テストに留め、
     *    Collection の挙動テストは専用のユニットテストに委ねる。
     */

    // usecase.execute() === GroupMembershipCollection &&
    // group_visibility_mode === 'none' => false
    it('should return false if group_visibility_mode is an invalid value even when viewer has group memberships', async () => {
      const groupMembership = GroupMembershipCollection.fromPrimitives([
        { group_id: groupId, member_id: memberId },
        { group_id: otherGroupId, member_id: memberId },
      ]);
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(groupMembership);

      expect(
        await rule.evaluate(
          createCtx({
            allow_groups: [groupId],
            group_visibility_mode: 'none' as unknown as undefined,
          }),
        ),
      ).toBe(false);
    });

    // usecase.execute() === GroupMembershipCollection &&
    // group_visibility_mode === 'all' &&
    // belongsAll() === true => true
    it('should return true if viewer belongs to all required groups (mode: all)', async () => {
      const groupMembership = GroupMembershipCollection.fromPrimitives([
        { group_id: groupId, member_id: memberId },
        { group_id: otherGroupId, member_id: memberId },
      ]);
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(groupMembership);

      expect(
        await rule.evaluate(
          createCtx({ allow_groups: [groupId], group_visibility_mode: 'all' }),
        ),
      ).toBe(true);
    });

    // usecase.execute() === GroupMembershipCollection &&
    // group_visibility_mode === 'all' &&
    // belongsAll() === false => false
    it('should return false if viewer lacks membership in at least one required group (mode: all)', async () => {
      const groupMembership = GroupMembershipCollection.fromPrimitives([
        { group_id: groupId, member_id: memberId },
      ]);
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(groupMembership);

      expect(
        await rule.evaluate(
          createCtx({
            allow_groups: [groupId, otherGroupId],
            group_visibility_mode: 'all',
          }),
        ),
      ).toBe(false);
    });

    // usecase.execute() === GroupMembershipCollection &&
    // group_visibility_mode === 'any' &&
    // belongsAny() === true => true
    it('should return true if viewer belongs to at least one required group (mode: any)', async () => {
      const groupMembership = GroupMembershipCollection.fromPrimitives([
        { group_id: groupId, member_id: memberId },
      ]);
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(groupMembership);

      expect(
        await rule.evaluate(
          createCtx({
            allow_groups: [groupId, otherGroupId],
            group_visibility_mode: 'any',
          }),
        ),
      ).toBe(true);
    });

    // usecase.execute() === GroupMembershipCollection &&
    // group_visibility_mode === 'any' &&
    // belongsAny() === false => false
    it('should return false if viewer belongs to none of the required groups (mode: any)', async () => {
      const groupMembership = GroupMembershipCollection.fromPrimitives([
        { group_id: groupId, member_id: memberId },
      ]);
      repository.findGroupIdsByMemberId.mockResolvedValueOnce(groupMembership);

      expect(
        await rule.evaluate(
          createCtx({
            allow_groups: [otherGroupId],
            group_visibility_mode: 'any',
          }),
        ),
      ).toBe(false);
    });
  });
});
