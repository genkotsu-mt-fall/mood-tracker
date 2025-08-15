import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { mapApiErrorWith } from '../core/map';
import { nestHttpExceptionMapper } from './nest-http-exception.mapper';
import { httpErrorsLikeMapper } from '../core/http-errors-like.mapper';

/**
 * グローバル例外フィルタ（プラットフォーム非依存に reply）
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response: unknown = http.getResponse();
    // const request = http.getRequest(); // 必要なら参照

    const { status, error } = mapApiErrorWith(exception, [
      nestHttpExceptionMapper,
      httpErrorsLikeMapper,
    ]);
    const body = { success: false, error };

    // 要件: httpAdapter.reply を利用
    this.adapterHost.httpAdapter.reply(response, body, status);
  }
}
