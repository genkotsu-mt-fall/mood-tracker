/* eslint-disable @typescript-eslint/unbound-method */
import { EvaluateVisibilityForPost } from 'src/visibility/application/evaluate-visibility-for-post';
import { PostRepository } from '../repository/post.repository';
import { FindAllPostsUseCase } from './find-all-posts.use-case';
import { createPost } from '../../../test/utils/post-helper';

/**
 * ============================
 * 🧪 単体テスト観点メモ：FindAllPostsUseCase
 * ============================
 *
 * このユースケースは、ユーザーから見える投稿を page + limit で返す処理。
 * 内部では「visible な投稿だけを limit 件かき集める」というロジックを、
 * while ループでバッチ取得・フィルタリングを繰り返すことで実現している。
 *
 * --- 🔁 処理の流れ（ループ内） ---
 * 1. fetchNextBatch(): 投稿バッチを取得（DB）
 * 2. extractVisiblePostsFromBatch(): 可視性チェック（ビジネスロジック）
 * 3. visiblePosts に追加し、limit 件に達したらループ終了
 *
 * --- ✅ テスト設計の観点 ---
 * - fetchNextBatch の戻り値（空 / 複数件）
 * - extractVisiblePostsFromBatch の戻り値（何件可視か）
 * - limit に達したか（hasNextPage 判定に影響）
 *
 * --- 🧩 テストパターンの例 ---
 * - バッチ1回で limit 達成 → ループ1回で終了
 * - 1回目は一部しか通らず、2回目で limit 達成
 * - 何度ループしても limit 未達 → fetch 終了
 * - 全件不可視 → 空配列返却
 *
 * --- 🗝 補足 ---
 * このような「非同期フィルタ＋バッチ処理」構造のユースケースでは、
 * 内部の fetch/フィルタ結果をモックで制御することで網羅的なテストが可能になる。
 */
describe('FindAllPostsUseCase', () => {
  let postRepo: jest.Mocked<PostRepository>;
  let visibilityEvaluator: jest.Mocked<EvaluateVisibilityForPost>;
  let usecase: FindAllPostsUseCase;
  const viewerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  beforeEach(() => {
    // postData = Array.from({ length: 5 }, () => createPost({}));

    postRepo = {
      create: jest.fn(),
      findAllWithCount: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    visibilityEvaluator = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EvaluateVisibilityForPost>;

    usecase = new FindAllPostsUseCase(postRepo, visibilityEvaluator);
  });

  // バッチ1回で limit 達成 → ループ1回で終了
  it('returns posts when all posts in the batch are visible and limit is reached in the first batch', async () => {
    const postData = Array.from({ length: 2 }, () => createPost({}));

    postRepo.findAllWithCount.mockResolvedValueOnce({
      data: postData,
      // total: postData.length,
    });

    visibilityEvaluator.execute.mockResolvedValue(true);

    const result = await usecase.execute(viewerId, {
      page: 1,
      limit: postData.length,
    });

    expect(result.data).toEqual(postData);
    expect(result.hasNextPage).toEqual(true);
    expect(visibilityEvaluator.execute).toHaveBeenCalledWith(
      postData[0],
      viewerId,
    );
    expect(visibilityEvaluator.execute).toHaveBeenCalledWith(
      postData[1],
      viewerId,
    );
  });

  // 1回目は一部しか通らず、2回目で limit 達成
  it('fetches multiple batches and continues until enough visible posts are found', async () => {
    const postData = Array.from({ length: 30 }, () => createPost({}));

    // limit => 2
    // 1回目: 20個取得 => 0個 visibilityEvaluator.execute.mockResolvedValue(false);
    // 2回目: 10個取得 => 2個 visibilityEvaluator.execute.mockResolvedValue(true);
    // 返却 : 2
    // hasNextPage: true
    // findAllWithCount が 2回呼ばれているか
    postRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: postData.slice(0, 20),
        // total: 20, // 1回目の返却データ（20件）DEFAULT_BATCH_SIZE = 20
      })
      .mockResolvedValueOnce({
        data: postData.slice(20),
        // total: 10, // 2回目の返却データ（10件）
      });

    visibilityEvaluator.execute.mockImplementation(() => {
      const calls = visibilityEvaluator.execute.mock.calls.length;
      //   console.log(`mockImplementation: calls = ${calls}`);
      return Promise.resolve(calls - 1 < 20 ? false : true);
    });

    const result = await usecase.execute(viewerId, { page: 1, limit: 2 });

    expect(result.data).toEqual(postData.slice(20, 22));
    expect(result.hasNextPage).toBe(true);
    expect(postRepo.findAllWithCount).toHaveBeenCalledTimes(2);
  });

  // 何度ループしても limit 未達 → fetch 終了
  it('returns empty array if no visible posts are found even after multiple fetches', async () => {
    const postData = Array.from({ length: 2 }, () => createPost({}));

    // 別に DEFAULT_BATCH_SIZE の数だけ返却しなくていいんだ
    postRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: postData.slice(0, 1),
        // total: 1,
      })
      .mockResolvedValueOnce({
        data: postData.slice(1),
        // total: 1,
      })
      .mockResolvedValueOnce({
        data: [],
        // total: 0,
      });

    visibilityEvaluator.execute
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const result = await usecase.execute(viewerId, { page: 1, limit: 2 });

    expect(result.data.length).toBe(1);
    expect(result.data).toEqual([postData[0]]);
    expect(result.hasNextPage).toBe(false);
  });

  // 全件不可視 → 空配列返却
  it('returns empty array when all posts are invisible', async () => {
    const postData = Array.from({ length: 2 }, () => createPost({}));

    postRepo.findAllWithCount
      .mockResolvedValueOnce({
        data: postData,
        // total: postData.length,
      })
      .mockResolvedValueOnce({
        data: [],
        // total: 0,
      });

    visibilityEvaluator.execute.mockResolvedValue(false);

    const result = await usecase.execute(viewerId, { page: 1, limit: 2 });

    expect(result.data.length).toBe(0);
    expect(result.data).toEqual([]);
    expect(result.hasNextPage).toBe(false);
  });
});
