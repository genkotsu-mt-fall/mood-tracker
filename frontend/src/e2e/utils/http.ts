import { NextResponse } from 'next/server';

export type FieldErrors = Record<string, string>;
export type ErrorShape = {
  code: string;
  message: string;
  fields?: FieldErrors;
};

function norm(input: string | ErrorShape, code: string): ErrorShape {
  return typeof input === 'string' ? { code, message: input } : input;
}

export function ok<T>(data: T, init?: number | ResponseInit) {
  const initObj = typeof init === 'number' ? { status: init } : init;
  return NextResponse.json(
    { success: true, data },
    { status: 200, ...initObj },
  );
}

export function badRequest(e: string | ErrorShape) {
  return NextResponse.json(
    { success: false, error: norm(e, 'BAD_REQUEST') },
    { status: 400 },
  );
}

export function unauthorized(e: string | ErrorShape = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: norm(e, 'UNAUTHORIZED') },
    { status: 401 },
  );
}

export function notFound(msg = 'Not found') {
  return NextResponse.json(
    { success: false, error: { code: 'NOT_FOUND', message: msg } },
    { status: 404 },
  );
}

export function internalError(err: unknown) {
  const msg = err instanceof Error ? err.message : 'Internal error';
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: msg } },
    { status: 500 },
  );
}
