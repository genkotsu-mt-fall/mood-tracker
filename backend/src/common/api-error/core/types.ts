import { ErrorCode } from 'src/common/errors/error-code';
import { ApiErrorResponse } from 'src/common/response/api-response';

export interface ApiErrorMapResult {
  status: number;
  error: ApiErrorResponse['error'];
}

/** core が使う評価コンテキスト */
export interface MapperContext {
  /** 本番判定の結果（boolean 化済み） */
  prod: boolean;
  /** オプション（default とマージ済み） */
  opts: Required<ApiErrorMapperOptions>;
}

/** 個別マッパーのシグネチャ（該当しなければ null を返す） */
export type ApiErrorMapperFn = (
  exception: unknown,
  ctx: MapperContext,
) => ApiErrorMapResult | null;

/** メッセージ抽出（Nest 以外でも使えるよう汎用 payload を受ける） */
export type MessageExtractor = (payload: any, exception: unknown) => string;

/** fields 抽出 */
export type FieldsExtractor = (payload: any) => Record<string, string[]> | null;

/** ステータス→コード解決 */
export type CodeResolver = (status: number) => ErrorCode | string;

/** 開発向け details 構築 */
export type DevDetailsBuilder = (
  exception: unknown,
) => Record<string, any> | undefined;

export interface ApiErrorMapperOptions {
  /** 本番判定（boolean か、遅延 function か） */
  isProd?: boolean | (() => boolean);
  /** メッセージ抽出 */
  extractMessage?: MessageExtractor;
  /** fields 抽出 */
  extractFields?: FieldsExtractor;
  /** ステータス→コード解決 */
  codeForStatus?: CodeResolver;
  /** 予期しない例外の既定ステータス */
  defaultStatus?: number;
  /** dev 時の details 構築 */
  buildDevDetails?: DevDetailsBuilder;
  /** cause を details に含めるか（dev 時） */
  includeCause?: boolean;
}
