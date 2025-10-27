import {
  GroupCreateBody,
  GroupResource,
} from '@genkotsu-mt-fall/shared/schemas';
import { Option } from '../common/types';

export async function createGroupClient(name: string): Promise<Option> {
  const r = await fetch('/api/group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name } satisfies GroupCreateBody),
  });

  const j = await r.json();

  if (!r.ok || !('success' in j) || !j.success) {
    const message = j.message || 'グループの作成に失敗しました';
    throw new Error(message);
  }

  const g = j.data as GroupResource;
  return { id: g.id, label: g.name };
}
