import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json({}, { status: 404 });
  // TODO: ダミーの current user
  return NextResponse.json({
    success: true,
    data: { id: 'me', email: 'e2e@example.com', name: 'E2E User' },
  });
}
