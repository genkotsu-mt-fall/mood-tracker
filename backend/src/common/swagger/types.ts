import { Type } from '@nestjs/common';
import { ApiErrorExample } from './errors/types';

/** 成功レスポンスの種類 */
export enum ResponseKind {
  Ok = 'ok',
  Created = 'created',
  Paginated = 'paginated',
}

export interface ResponseOption {
  /** DTO 型 */
  type: Type<any>;
  /** 200/201/200(paginated) のどれか。デフォルト Ok */
  kind?: ResponseKind;
  /** レスポンス説明 */
  description?: string;

  isArray?: boolean;
}

export interface IdParamOption {
  /** ID パラメータの有無 */
  id?: boolean;
  /** ID パラメータの説明 */
  idParamDescription?: string;
}

// export interface ErrorOptions {
//   badRequest?: boolean;
//   unauthorized?: boolean;
//   forbidden?: boolean;
//   notFound?: boolean;
//   conflict?: boolean;
// }
export type ErrorStatusConfig =
  | boolean
  | {
      description?: string;
      example?: ApiErrorExample;
    };

export interface ErrorOptions {
  badRequest?: ErrorStatusConfig;
  unauthorized?: ErrorStatusConfig;
  forbidden?: ErrorStatusConfig;
  notFound?: ErrorStatusConfig;
  conflict?: ErrorStatusConfig;
  unprocessableEntity?: ErrorStatusConfig;
  tooManyRequests?: ErrorStatusConfig;
  serviceUnavailable?: ErrorStatusConfig;
  internal?: ErrorStatusConfig; // 500

  /** 任意のステータスを追加したい場合 */
  extra?: Array<{
    status: number;
    description?: string;
    example?: ApiErrorExample;
  }>;
}

export interface ApiEndpointOptions {
  /** UI のサマリ（ほぼ必須） */
  summary: string;
  /** 詳細説明 */
  description?: string;

  /** リクエストボディ DTO（ある場合のみ） */
  body?: Type<unknown>;

  /** レスポンス DTO と種別 */
  response: ResponseOption;

  /** Bearer 認証の有無 */
  auth?: boolean;

  idParam?: IdParamOption;

  errors?: ErrorOptions;

  /** スキーマ解決に含めたい追加モデル */
  extraModels?: Type<any>[];
}

export type ApiDecorators = Array<
  ClassDecorator | MethodDecorator | PropertyDecorator
>;

/** 既定の説明文（空ならここで補う） */
export function defaultResponseDescription(kind: ResponseKind): string {
  switch (kind) {
    case ResponseKind.Created:
      return 'Resource created successfully';
    case ResponseKind.Paginated:
      return 'Resources retrieved successfully';
    default:
      return 'OK';
  }
}
