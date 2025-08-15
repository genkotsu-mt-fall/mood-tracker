import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';
import { FindAllPostsUseCase } from '../../post-query/use-case/find-all-posts.use-case';
import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { FindGroupIdsByMemberIdUseCase } from 'src/group-member/use-case/find-group-ids-by-member-id.usecase';
import { FollowRepository } from 'src/follow/repository/follow.repository';
import { GroupMemberRepository } from 'src/group-member/repository/group-member.repository';
import { createPost, postOwnerId } from '../../../test/utils/post-helper';
import { addDays } from '../../../test/utils/date-helper';
import { GroupMembershipCollection } from 'src/group-member/entity/group-membership.collection';
import { FollowEntity } from 'src/follow/entity/follow.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { PostQueryRepository } from '../repository/post-query.repository';
import { VisiblePostsQueryRunner } from './shared/visible-posts-query-runner';

describe('EvaluateVisibilityForPost Integration test', () => {
  let folloRepository: jest.Mocked<FollowRepository>;
  let findFollowRelationUseCase: FindFollowRelationUseCase;

  let groupMemberRepo: jest.Mocked<GroupMemberRepository>;
  let findGroupIdsByMemberIdUseCase: FindGroupIdsByMemberIdUseCase;

  let evaluatePostVisibility: EvaluateVisibilityForPost;
  let postQueryRepo: jest.Mocked<PostQueryRepository>;
  let usecase: FindAllPostsUseCase;

  //   const postId = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
  const viewerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  //   const postOwnerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
  const otherUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
  const belongGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d482';
  const notBelongGroupId = 'f47ac10b-58cc-4372-a567-0e02b2c3d483';
  const followId = 'f47ac10b-58cc-4372-a567-0e02b2c3d484';
  const viewerOwnPostId = 'f47ac10b-58cc-4372-a567-0e02b2c3d485';

  let groupData: GroupMembershipCollection;
  let followData: FollowEntity;

  beforeEach(() => {
    folloRepository = {
      // create: jest.fn(),
      // findAllWithCount: jest.fn(),
      // findById: jest.fn(),
      findFollowRelation: jest.fn(), // 使用
      // delete: jest.fn(),
    } as unknown as jest.Mocked<FollowRepository>;
    findFollowRelationUseCase = new FindFollowRelationUseCase(folloRepository);

    groupMemberRepo = {
      // create: jest.fn(),
      // findAllWithCount: jest.fn(),
      // findById: jest.fn(),
      findGroupIdsByMemberId: jest.fn(), // 使用
      // loadWithGroupOwnerById: jest.fn(),
      // delete: jest.fn(),
    } as unknown as jest.Mocked<GroupMemberRepository>;
    findGroupIdsByMemberIdUseCase = new FindGroupIdsByMemberIdUseCase(
      groupMemberRepo,
    );
    evaluatePostVisibility = new EvaluateVisibilityForPost(
      findFollowRelationUseCase,
      findGroupIdsByMemberIdUseCase,
    );

    postQueryRepo = {
      // create: jest.fn(),
      findAllWithCount: jest.fn(), // 使用
      // findById: jest.fn(),
      // update: jest.fn(),
      // delete: jest.fn(),
    } as unknown as jest.Mocked<PostQueryRepository>;
    const runner = new VisiblePostsQueryRunner(evaluatePostVisibility);
    usecase = new FindAllPostsUseCase(postQueryRepo, runner);

    groupData = GroupMembershipCollection.fromPrimitives([
      {
        group_id: belongGroupId,
        member_id: viewerId,
      },
    ]);

    followData = new FollowEntity(followId, viewerId, postOwnerId, new Date());
  });

  // バッチ1回で limit 達成 → ループ1回で終了
  // limit: 5
  // take: 20
  // 1 (OK) AllowUserRule
  // (NG) AllowUserRule
  // 2 (OK) GroupMembershipRule
  // (NG) GroupMembershipRule
  // 3 (OK) FollowRule
  // (NG) FollowRule
  // 4 (OK) ScheduledRule
  // (NG) ScheduledRule
  // 5 (OK) DenyUserRule
  // (NG) DenyUserRule
  it('returns exactly the visible posts across all visibility rules when fetched in a single batch', async () => {
    const expectedPostResultCount = 5;

    const visiblePosts = [
      createPost({ allow_users: [viewerId] }), // OK
      createPost({
        allow_groups: [belongGroupId],
        group_visibility_mode: 'all',
      }), // OK
      createPost({ followers_only: true }), // OK
      createPost({ visible_until: addDays(1) }), // OK
      createPost({ deny_users: [otherUserId] }), // OK
    ];

    const hiddenPosts = [
      createPost({ allow_users: [otherUserId] }), // NG
      createPost({
        allow_groups: [notBelongGroupId],
        group_visibility_mode: 'all',
      }), // NG
      createPost({ followers_only: true, follow_back_only: true }), // NG
      createPost({ visible_after: addDays(1) }), // NG
      createPost({ deny_users: [viewerId] }), // NG
    ];

    const postData = [...visiblePosts, ...hiddenPosts];

    postQueryRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: postData,
        // total: postData.length,
      })
      .mockResolvedValue({ data: [] /*total: 0*/ });

    groupMemberRepo.findGroupIdsByMemberId
      .mockResolvedValueOnce(groupData)
      .mockResolvedValue(null);

    folloRepository.findFollowRelation
      .mockResolvedValueOnce(followData)
      .mockResolvedValue(null);

    const result = await usecase.execute(viewerId, {
      page: 1,
      limit: expectedPostResultCount,
    });

    expect(result.data.length).toBe(expectedPostResultCount);
    expect(result.data).toStrictEqual(visiblePosts);
    expect(result.meta?.hasNext).toBe(true);
  });

  // 1回目は一部しか通らず、2回目で limit 達成
  it('fetches multiple batches and continues until enough visible posts are found', async () => {
    const expectedPostResultCount = 5;

    const visibleFromFirstBatch = [
      createPost({ allow_users: [viewerId], visible_until: addDays(1) }),
      createPost({
        deny_users: [otherUserId],
        allow_groups: [belongGroupId],
        group_visibility_mode: 'all',
      }),
    ];

    const hiddenFromFirstBatch = [
      createPost({ allow_users: [otherUserId] }), // NG
      createPost({
        allow_groups: [notBelongGroupId],
        group_visibility_mode: 'all',
      }), // NG
    ];

    const visibleFromSecondBatch = [
      createPost({ visible_until: addDays(1), visible_after: addDays(-1) }),
      new PostEntity({
        id: viewerOwnPostId,
        userId: viewerId,
        body: 'own post',
        createdAt: new Date(),
        updatedAt: new Date(),
        crisisFlag: false,
        privacyJson: {
          allow_groups: [notBelongGroupId],
          group_visibility_mode: 'all',
        },
      }), // 閲覧者自身の投稿なのでOK
      createPost({}),
    ];

    const hiddenFromSecondBatch = [
      createPost({ followers_only: true, follow_back_only: true }), // NG
      createPost({ visible_after: addDays(1) }), // NG
      createPost({ deny_users: [viewerId] }), // NG
    ];

    const firstBatchPosts = [...visibleFromFirstBatch, ...hiddenFromFirstBatch];
    const secondBatchPosts = [
      ...visibleFromSecondBatch,
      ...hiddenFromSecondBatch,
    ];

    const expectedVisiblePosts = [
      ...visibleFromFirstBatch,
      ...visibleFromSecondBatch,
    ];

    postQueryRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: firstBatchPosts,
        // total: firstBatchPosts.length,
      })
      .mockResolvedValueOnce({
        data: secondBatchPosts,
        // total: secondBatchPosts.length,
      });

    groupMemberRepo.findGroupIdsByMemberId
      .mockResolvedValueOnce(groupData)
      .mockResolvedValue(null);

    folloRepository.findFollowRelation
      .mockResolvedValueOnce(followData)
      .mockResolvedValue(null);

    const result = await usecase.execute(viewerId, {
      page: 1,
      limit: expectedPostResultCount,
    });

    expect(result.data.length).toBe(expectedPostResultCount);
    expect(result.data).toStrictEqual(expectedVisiblePosts);
    expect(result.meta?.hasNext).toBe(true);
  });

  // 何度ループしても limit 未達 → fetch 終了
  it('returns visible posts even if they do not reach the limit', async () => {
    const expectedPostResultCount = 5;

    const visibleFromFirstBatch = [
      createPost({ allow_users: [viewerId], visible_until: addDays(1) }),
      createPost({
        deny_users: [otherUserId],
        allow_groups: [belongGroupId],
        group_visibility_mode: 'all',
      }),
    ];

    const hiddenFromFirstBatch = [
      createPost({ allow_users: [otherUserId] }), // NG
      createPost({
        allow_groups: [notBelongGroupId],
        group_visibility_mode: 'all',
      }), // NG
    ];

    const firstBatchPosts = [...visibleFromFirstBatch, ...hiddenFromFirstBatch];

    postQueryRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: firstBatchPosts,
        // total: firstBatchPosts.length,
      })
      .mockResolvedValue({
        data: [],
        // total: 0,
      });

    groupMemberRepo.findGroupIdsByMemberId
      .mockResolvedValueOnce(groupData)
      .mockResolvedValue(null);

    const result = await usecase.execute(viewerId, {
      page: 1,
      limit: expectedPostResultCount,
    });

    expect(result.data).toStrictEqual(visibleFromFirstBatch);
    expect(result.meta?.hasNext).toBe(false);
  });

  // 全件不可視 → 空配列返却
  it('returns empty array when all posts are invisible', async () => {
    const expectedPostResultCount = 5;

    const hiddenFromFirstBatch = [
      createPost({ allow_users: [otherUserId] }), // NG
      createPost({
        allow_groups: [notBelongGroupId],
        group_visibility_mode: 'all',
      }), // NG
    ];

    postQueryRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: hiddenFromFirstBatch,
        // total: hiddenFromFirstBatch.length,
      })
      .mockResolvedValue({
        data: [],
        // total: 0,
      });

    groupMemberRepo.findGroupIdsByMemberId.mockResolvedValue(null);

    const result = await usecase.execute(viewerId, {
      page: 1,
      limit: expectedPostResultCount,
    });

    expect(result.data.length).toBe(0);
    expect(result.data).toEqual([]);
    expect(result.meta?.hasNext).toBe(false);
  });
});
