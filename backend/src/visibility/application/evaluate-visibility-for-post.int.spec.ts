import { FollowRepository } from 'src/follow/repository/follow.repository';
import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { GroupMemberRepository } from 'src/group-member/repository/group-member.repository';
import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';
import { PostEntity } from 'src/post/entity/post.entity';
import { EvaluateVisibilityForPost } from './evaluate-visibility-for-post';
import { addDays } from '../../../test/utils/date-helper';
import { FollowEntity } from 'src/follow/entity/follow.entity';
import { GroupMembershipCollection } from 'src/group-member/entity/group-membership.collection';
import {
  createPost,
  postId,
  postOwnerId,
} from '../../../test/utils/post-helper';

describe('EvaluateVisibilityForPost', () => {
  let findFollowRelationUseCase: FindFollowRelationUseCase;
  let followRepo: jest.Mocked<FollowRepository>;
  let findGroupIdsByMemberIdUseCase: FindGroupIdsByMemberIdUseCase;
  let groupMemberRepo: jest.Mocked<GroupMemberRepository>;
  let evaluatePostVisibility: EvaluateVisibilityForPost;

  // const postId = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
  const viewerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const otherUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
  // const postOwnerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';
  const followId = 'f47ac10b-58cc-4372-a567-0e02b2c3d482';
  const groupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d483';

  beforeEach(() => {
    followRepo = {
      findFollowRelation: jest.fn(), //テストで使用
      // create: jest.fn(),
      // findAllWithCount: jest.fn(),
      // findById: jest.fn(),
      // delete: jest.fn(),
    } as unknown as jest.Mocked<FollowRepository>;
    findFollowRelationUseCase = new FindFollowRelationUseCase(followRepo);

    groupMemberRepo = {
      create: jest.fn(),
      findAllWithCount: jest.fn(),
      findById: jest.fn(),
      findGroupIdsByMemberId: jest.fn(), //テストで使用
      loadWithGroupOwnerById: jest.fn(),
      delete: jest.fn(),
    };
    findGroupIdsByMemberIdUseCase = new FindGroupIdsByMemberIdUseCase(
      groupMemberRepo,
    );

    evaluatePostVisibility = new EvaluateVisibilityForPost(
      findFollowRelationUseCase,
      findGroupIdsByMemberIdUseCase,
    );
  });

  // 投稿者本人 => true
  it('returns true when the viewer is the author', async () => {
    const post = new PostEntity({
      id: postId,
      userId: viewerId,
      body: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      crisisFlag: false,
    });
    expect(await evaluatePostVisibility.execute(post, viewerId)).toBe(true);
  });

  // const createPost = (privacyJson: PostEntity['privacyJson']): PostEntity => {
  //   return new PostEntity({
  //     id: postId,
  //     userId: postOwnerId,
  //     body: 'test',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     crisisFlag: false,
  //     privacyJson,
  //   });
  // };

  const mockViewerAsGroupMember = () => {
    const groupMembership = GroupMembershipCollection.fromPrimitives([
      { group_id: groupId, member_id: viewerId },
    ]);
    groupMemberRepo.findGroupIdsByMemberId.mockResolvedValueOnce(
      groupMembership,
    );
  };

  const mockViewerFollowsPostOwner = () => {
    const follow = new FollowEntity(
      followId,
      viewerId,
      postOwnerId,
      new Date(),
    );
    followRepo.findFollowRelation.mockResolvedValueOnce(follow);
  };

  // どれかのルールで閲覧不可 => false
  // AllowUserRule: viewer not in allow_users => false
  it('returns false when viewer is not in allow_users list', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ allow_users: [otherUserId] }),
        viewerId,
      ),
    ).toBe(false);
  });

  // AllowUserRule: viewer in allow_users => true
  it('returns true when viewer is in allow_users list', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ allow_users: [viewerId] }),
        viewerId,
      ),
    ).toBe(true);
  });

  // DenyUserRule: viewer in deny_users => false
  it('returns false when viewer is in deny_users list', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ deny_users: [viewerId] }),
        viewerId,
      ),
    ).toBe(false);
  });

  // DenyUserRule: viewer not in deny_users => true
  it('returns true when viewer is not in deny_users list', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ deny_users: [otherUserId] }),
        viewerId,
      ),
    ).toBe(true);
  });

  // AllowUserRule + DenyUserRule: viewer in both => false
  it('returns false when viewer is in both allow_users and deny_users lists', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ allow_users: [viewerId], deny_users: [viewerId] }),
        viewerId,
      ),
    ).toBe(false);
  });

  // FollowRule: no follow relation => false
  it('returns false when viewer does not follow the author (followers_only)', async () => {
    followRepo.findFollowRelation.mockResolvedValueOnce(null);
    expect(
      await evaluatePostVisibility.execute(
        createPost({ followers_only: true }),
        viewerId,
      ),
    ).toBe(false);
  });

  // FollowRule: follow relation exists => true
  it('returns true when viewer follows the author (followers_only)', async () => {
    mockViewerFollowsPostOwner();
    expect(
      await evaluatePostVisibility.execute(
        createPost({ followers_only: true }),
        viewerId,
      ),
    ).toBe(true);
  });

  // GroupMembershipRule: viewer not in allowed groups => false
  it('returns false when viewer is not a member of allowed group', async () => {
    groupMemberRepo.findGroupIdsByMemberId.mockResolvedValueOnce(null);
    expect(
      await evaluatePostVisibility.execute(
        createPost({ allow_groups: [groupId], group_visibility_mode: 'all' }),
        viewerId,
      ),
    ).toBe(false);
  });

  // GroupMembershipRule: viewer in allowed groups => true
  it('returns true when viewer is a member of allowed group', async () => {
    mockViewerAsGroupMember();
    expect(
      await evaluatePostVisibility.execute(
        createPost({ allow_groups: [groupId], group_visibility_mode: 'all' }),
        viewerId,
      ),
    ).toBe(true);
  });

  // ScheduledRule: visible_after is in the future => false
  it('returns false when visible_after is set in the future', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ visible_after: addDays(1) }),
        viewerId,
      ),
    ).toBe(false);
  });

  // ScheduledRule: visible_until is in the future => true
  it('returns true when visible_until is in the future', async () => {
    expect(
      await evaluatePostVisibility.execute(
        createPost({ visible_until: addDays(1) }),
        viewerId,
      ),
    ).toBe(true);
  });

  // All rules pass => true
  it('returns true when viewer passes all visibility rules', async () => {
    mockViewerFollowsPostOwner();
    mockViewerAsGroupMember();
    expect(
      await evaluatePostVisibility.execute(
        createPost({
          allow_users: [viewerId],
          deny_users: [otherUserId],
          followers_only: true,
          allow_groups: [groupId],
          group_visibility_mode: 'all',
          visible_after: addDays(-1),
          visible_until: addDays(1),
        }),
        viewerId,
      ),
    ).toBe(true);
  });
});
