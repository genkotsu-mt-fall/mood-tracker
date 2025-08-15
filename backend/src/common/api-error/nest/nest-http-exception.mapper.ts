import { HttpException } from '@nestjs/common';
import { ApiErrorMapperFn } from '../core/types';
import { ApiErrorResponse } from 'src/common/response/api-response';

type MaybeExceptionPayload = {
  code?: string;
  message?: string;
  fields?: unknown;
  details?: unknown;
  [key: string]: unknown;
};

/**
 * Nest の HttpException 系を ApiError に変換するマッパー
 */
export const nestHttpExceptionMapper: ApiErrorMapperFn = (exception, ctx) => {
  if (!(exception instanceof HttpException)) return null;

  const status = exception.getStatus();
  const raw = exception.getResponse();
  const payload: MaybeExceptionPayload =
    typeof raw === 'object' && raw !== null
      ? (raw as MaybeExceptionPayload)
      : { message: raw };

  const message = ctx.opts.extractMessage(payload, exception);
  const fields = ctx.opts.extractFields(payload);

  const base: ApiErrorResponse['error'] = {
    code: payload.code ?? ctx.opts.codeForStatus(status),
    message,
    fields: fields ?? null,
  };

  if (!ctx.prod) {
    // ES2022 の Error cause は任意型（unknown）。外部ライブラリ由来で string/number/null なども来る。
    // いきなり cause?.message を読むと型/実行時バグの温床になるため、段階的に安全確認してから取り出す。
    const cause = exception.cause;
    let causeMessage: string | undefined = undefined;

    if (
      // 1) null/undefined を除外（ここで落とさないと次の in 演算子で落ちうる）
      cause &&
      // 2) in 演算子は右辺が object/function 以外だと例外になるため、まず object を保証
      typeof cause === 'object' &&
      // 3) "message" プロパティが存在することを確認（プロトタイプ上の定義も拾える）
      'message' in cause &&
      // 4) たとえ message が存在しても型は不定。最終的に string であることを確定してから読む
      typeof (cause as { message?: unknown }).message === 'string'
    ) {
      // ここまで来て初めて "message は string" と断言して安全に取得できる
      causeMessage = (cause as { message: string }).message;
    }
    // → これにより「読める時だけ読む」防御的ダックタイピングを実現（instanceof Error に依存しない）

    base.details =
      payload.details ??
      (ctx.opts.includeCause && causeMessage
        ? { cause: causeMessage }
        : undefined);
  }

  return { status, error: base };
};
