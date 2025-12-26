import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  // 一覧
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  const body = await req.json().catch(() => ({}));
  // 作成
  return NextResponse.json({
    success: true,
    data: {
      id: 'post_dummy',
      body: body?.body ?? '',
      createdAt: new Date().toISOString(),
    },
  });
}
