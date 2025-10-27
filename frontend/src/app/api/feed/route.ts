import { fetchPostsFromApi } from '@/lib/post/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetchPostsFromApi();
  if (!res.ok) {
    return NextResponse.json(
      { success: false, message: res.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true, data: res.data }, { status: 200 });
}
