import { fetchUsersFromApi } from '@/lib/user/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetchUsersFromApi();
  if (!res.ok)
    return NextResponse.json(
      { success: false, message: res.message },
      { status: 500 },
    ); //TODO: ステータスコードの使い分け
  return NextResponse.json({ success: true, data: res.data }, { status: 200 });
}
