import { zodToFieldErrors } from '@/lib/actions/state';
import { createGroupMemberFromApi } from '@/lib/group-member/api';
import { GroupMemberCreateBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 },
    );
  }

  const parsed = GroupMemberCreateBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message:
          '送信されたデータが壊れているか、悪意のある値が含まれています。',
        fields: zodToFieldErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  const res = await createGroupMemberFromApi({
    groupId: parsed.data.groupId,
    memberId: parsed.data.memberId,
  });
  if (!res.ok) {
    const status = res.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json(
      {
        success: false,
        message: res.message,
        fields: res.fields,
      },
      { status },
    );
  }

  return NextResponse.json({ success: true, data: res.data }, { status: 201 });
}
