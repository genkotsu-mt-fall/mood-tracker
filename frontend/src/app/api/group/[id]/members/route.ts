import { NextResponse } from 'next/server';
import { fetchGroupMembersFromApi } from '@/lib/group/api';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const res = await fetchGroupMembersFromApi(id);

  if (!res.ok) {
    const status = res.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      { success: false, message: res.message },
      { status },
    );
  }
  return NextResponse.json({ success: true, data: res.data });
}
