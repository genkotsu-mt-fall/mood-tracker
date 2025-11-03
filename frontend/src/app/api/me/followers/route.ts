import { NextResponse } from 'next/server';
import { fetchMyFollowersFromApi } from '@/lib/user/api';

export async function GET() {
  const res = await fetchMyFollowersFromApi();
  if (!res.ok) {
    return NextResponse.json(
      { success: false, message: res.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data: res.data }, { status: 200 });
}
