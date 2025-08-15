import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

function wrapOkSchema(model: Type<unknown>) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        $ref: getSchemaPath(model),
      },
    },
    required: ['success', 'data'],
  };
}

function paginationMetaSchema() {
  return {
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      pageSize: { type: 'number', example: 20 },
      hasNext: { type: 'boolean', example: true },
      total: { type: 'number', nullable: true, example: 123 },
    },
    required: ['page', 'pageSize', 'hasNext'],
  };
}

function wrapOkPaginatedSchema(model: Type<unknown>) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      },
      meta: paginationMetaSchema(),
    },
    required: ['success', 'data'],
  };
}

function wrapOkArraySchema(model: Type<unknown>) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'array', items: { $ref: getSchemaPath(model) } },
    },
    required: ['success', 'data'],
  };
}

export function ApiOkWrapped<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({ description, schema: wrapOkSchema(model) }),
  );
}

export function ApiOkArrayWrapped<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({ description, schema: wrapOkArraySchema(model) }),
  );
}

export function ApiCreatedWrapped<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({ description, schema: wrapOkSchema(model) }),
  );
}

export function ApiCreatedArrayWrapped<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({ description, schema: wrapOkArraySchema(model) }),
  );
}

export function ApiOkPaginatedWrapped<TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({ description, schema: wrapOkPaginatedSchema(model) }),
  );
}
