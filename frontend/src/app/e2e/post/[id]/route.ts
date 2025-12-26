import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  return NextResponse.json({
    success: true,
    data: { id: params.id, body: 'dummy', createdAt: new Date().toISOString() },
  });
}
