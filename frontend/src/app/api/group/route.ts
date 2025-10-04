import { zodToFieldErrors } from '@/lib/actions/state';
import { createGroupFromApi } from '@/lib/group/api';
import { groupCreateSchema } from '@/lib/group/schemas';
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

  const parsed = groupCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: '入力内容をご確認ください。',
        fields: zodToFieldErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  const res = await createGroupFromApi({ name: parsed.data.name });
  if (!res.ok) {
    const status = res.message === 'Unauthorized' ? 401 : 500; // ← ここ追加
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
