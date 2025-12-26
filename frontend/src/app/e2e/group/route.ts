import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  const body = await req.json().catch(() => ({}));
  // TODO: グループ作成
  return NextResponse.json({
    success: true,
    data: { id: 'grp_dummy', name: body?.name ?? 'Dummy Group' },
  });
}
