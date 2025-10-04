import { fetchUsers } from '@/lib/user/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = await fetchUsers();
  if (!res.ok)
    return NextResponse.json(
      { success: false, message: res.message },
      { status: 500 },
    ); //TODO: ステータスコードの使い分け
  return NextResponse.json({ success: true, data: res.data }, { status: 200 });
}
