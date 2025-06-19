import { FindFollowRelationUseCase } from 'src/follow/use-case/find-follow-relation.usecase';
import { VisibilityContext } from '../context/visibility-context';
import { FollowRule } from './follow.rule';
import { FollowRepository } from 'src/follow/repository/follow.repository';
import { addDays } from '../../../test/utils/date-helper';
import { FollowEntity } from 'src/follow/entity/follow.entity';

describe('FollowRule', () => {
  // モック不要
  describe('shouldEvaluate', () => {
    // followers_only === undefined &&
    // follow_back_only === undefined &&
    // min_follow_days === undefined &&
    // max_follow_days === undefined => false
    it('should return false when all follow-related settings are undefined', () => {
      const ctx: VisibilityContext = {
        viewerId: '',
        postOwnerId: '',
        setting: {},
      };
      expect(FollowRule.shouldEvaluate(ctx)).toBe(false);
    });

    // followers_only === true &&
    // follow_back_only === undefined &&
    // min_follow_days === undefined &&
    // max_follow_days === undefined => true
    it('should return true when only followers_only is true', () => {
      const ctx: VisibilityContext = {
        viewerId: '',
        postOwnerId: '',
        setting: { followers_only: true },
      };
      expect(FollowRule.shouldEvaluate(ctx)).toBe(true);
    });

    // followers_only === false &&
    // follow_back_only === undefined &&
    // min_follow_days === undefined &&
    // max_follow_days === undefined => false
    it('should return false when only followers_only is false', () => {
      const ctx: VisibilityContext = {
        viewerId: '',
        postOwnerId: '',
        setting: { followers_only: false },
      };
      expect(FollowRule.shouldEvaluate(ctx)).toBe(false);
    });

    // followers_only === false &&
    // follow_back_only === false &&
    // min_follow_days === 10 &&
    // max_follow_days === undefined => true
    it('should return true when min_follow_days is set even if followers_only and follow_back_only are false', () => {
      const ctx: VisibilityContext = {
        viewerId: '',
        postOwnerId: '',
        setting: {
          followers_only: false,
          follow_back_only: false,
          min_follow_days: 10,
        },
      };
      expect(FollowRule.shouldEvaluate(ctx)).toBe(true);
    });
  });

  // モック必要
  describe('evaluate', () => {
    let mockFollowRepo: jest.Mocked<FollowRepository>;
    let usecase: FindFollowRelationUseCase;
    let rule: FollowRule;
    const id = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
    const viewerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const postOwnerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';

    const createFollowEntity = (daysAgo: number): FollowEntity => {
      return new FollowEntity(
        id,
        viewerId,
        postOwnerId,
        new Date(addDays(daysAgo)),
      );
    };

    const mockViewerFollows = (daysAgo: number) => {
      mockFollowRepo.findFollowRelation.mockResolvedValueOnce(
        createFollowEntity(daysAgo),
      );
    };

    const createCtx = (
      setting: VisibilityContext['setting'],
    ): VisibilityContext => ({ viewerId, postOwnerId, setting });

    beforeEach(() => {
      mockFollowRepo = {
        findFollowRelation: jest.fn(), //テストで使用
        // create: jest.fn(),
        // findAllWithCount: jest.fn(),
        // findById: jest.fn(),
        // delete: jest.fn(),
      } as unknown as jest.Mocked<FollowRepository>;

      usecase = new FindFollowRelationUseCase(mockFollowRepo);
      rule = new FollowRule(usecase);
    });

    // 投稿主をフォローしていない
    // [モック]usecase.execute() === null => false
    it('should return false when viewer does not follow the post owner', async () => {
      mockFollowRepo.findFollowRelation.mockResolvedValueOnce(null);
      expect(await rule.evaluate(createCtx({}))).toBe(false);
    });

    // 投稿主をフォローしている
    // [モック]usecase.execute() === FollowEntity
    it('should return true when viewer follows the post owner and no additional conditions are set', async () => {
      mockViewerFollows(0);
      expect(await rule.evaluate(createCtx({}))).toBe(true);
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === 10 &&
    // rule.viewerToPostOwnerFollow?.followedAt === null => false
    it('should return false when viewer follows the post owner but follow date is null and min_follow_days is set', async () => {
      const followEntity = new FollowEntity(
        id,
        viewerId,
        postOwnerId,
        null as unknown as Date,
      );
      mockFollowRepo.findFollowRelation.mockResolvedValueOnce(followEntity);
      expect(await rule.evaluate(createCtx({ min_follow_days: 10 }))).toBe(
        false,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === 10 &&
    // min_follow_days > rule.viewerToPostOwnerFollow.followedAt => false
    it('should return false when viewer follows the post owner but follow duration is shorter than min_follow_days', async () => {
      mockViewerFollows(0);
      expect(await rule.evaluate(createCtx({ min_follow_days: 10 }))).toBe(
        false,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === 10 &&
    // min_follow_days = rule.viewerToPostOwnerFollow.followedAt => true
    it('should return true when viewer follows the post owner and follow duration is exactly min_follow_days', async () => {
      mockViewerFollows(-10);
      expect(await rule.evaluate(createCtx({ min_follow_days: 10 }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === 10 &&
    // min_follow_days < rule.viewerToPostOwnerFollow.followedAt => true
    it('should return true when viewer follows the post owner and follow duration exceeds min_follow_days', async () => {
      mockViewerFollows(-11);
      expect(await rule.evaluate(createCtx({ min_follow_days: 10 }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // max_follow_days === 10 &&
    // max_follow_days > rule.viewerToPostOwnerFollow.followedAt => true
    it('should return true when viewer follows the post owner and follow duration is less than max_follow_days', async () => {
      mockViewerFollows(-1);
      expect(await rule.evaluate(createCtx({ max_follow_days: 10 }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // max_follow_days === 10 &&
    // max_follow_days = rule.viewerToPostOwnerFollow.followedAt => true
    it('should return true when viewer follows the post owner and follow duration is exactly max_follow_days', async () => {
      mockViewerFollows(-10);
      expect(await rule.evaluate(createCtx({ max_follow_days: 10 }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // max_follow_days === 10 &&
    // max_follow_days < rule.viewerToPostOwnerFollow.followedAt => false
    it('should return false when viewer follows the post owner but follow duration exceeds max_follow_days', async () => {
      mockViewerFollows(-11);
      expect(await rule.evaluate(createCtx({ max_follow_days: 10 }))).toBe(
        false,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === undefined &&
    // max_follow_days === undefined &&
    // follow_back_only === false => true
    it('should return true when viewer follows the post owner and follow_back_only is false', async () => {
      mockViewerFollows(0);
      expect(await rule.evaluate(createCtx({ follow_back_only: false }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === undefined &&
    // max_follow_days === undefined &&
    // follow_back_only === true &&
    // 投稿主がフォロバしている => true
    it('should return true when viewer follows the post owner and follow_back_only is true and post owner follows back', async () => {
      mockViewerFollows(0);
      mockFollowRepo.findFollowRelation.mockResolvedValueOnce(
        new FollowEntity(id, postOwnerId, viewerId, new Date(addDays(0))),
      );
      expect(await rule.evaluate(createCtx({ follow_back_only: true }))).toBe(
        true,
      );
    });

    // 投稿主をフォローしている &&
    // [モック]usecase.execute() === FollowEntity
    // min_follow_days === undefined &&
    // max_follow_days === undefined &&
    // follow_back_only === true &&
    // 投稿主がフォロバしていない => false
    it('should return false when viewer follows the post owner and follow_back_only is true but post owner does not follow back', async () => {
      mockViewerFollows(0);
      mockFollowRepo.findFollowRelation.mockResolvedValueOnce(null);
      expect(await rule.evaluate(createCtx({ follow_back_only: true }))).toBe(
        false,
      );
    });
  });
});
