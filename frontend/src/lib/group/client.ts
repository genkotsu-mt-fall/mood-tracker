import { Option } from '../common/types';
import { GroupData } from './api';

type CreateGroupBody = {
  name: string;
};

export async function createGroupClient(name: string): Promise<Option> {
  const r = await fetch('/api/group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name } satisfies CreateGroupBody),
  });

  const j = await r.json();

  if (!r.ok || !('success' in j) || !j.success) {
    const message = j.message || 'グループの作成に失敗しました';
    throw new Error(message);
  }

  const g = j.data as GroupData;
  return { id: g.id, label: g.name };
}
