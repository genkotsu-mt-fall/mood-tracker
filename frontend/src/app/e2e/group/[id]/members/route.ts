import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  const body = await req.json().catch(() => ({}));
  // TODO: メンバー追加
  return NextResponse.json({
    success: true,
    data: { groupId: params.id, members: body?.userIds ?? [] },
  });
}
