import { fetchGroupsFromApi } from '@/lib/group/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetchGroupsFromApi();
  if (!res.ok) {
    const status = res.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { success: false, message: res.message },
      { status },
    );
  }
  return NextResponse.json({ success: true, data: res.data });
}
