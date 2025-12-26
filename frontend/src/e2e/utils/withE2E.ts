import type { NextRequest } from 'next/server';
import { notFound, internalError } from './http';

type Ctx = { params: Record<string, string> };
type Handler = (req: NextRequest, ctx: Ctx) => Promise<Response> | Response;

export function withE2E(handler: Handler) {
  return async (req: NextRequest, ctx: Ctx) => {
    if (process.env.NODE_ENV === 'production') {
      return notFound();
    }
    try {
      return await handler(req, ctx);
    } catch (e) {
      return internalError(e);
    }
  };
}
