import {
  MessageResource,
  MessageResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { bffDel, unwrapOrThrow } from '@/lib/bff/request';

export async function deletePostClient(id: string): Promise<MessageResource> {
  const r = await bffDel<MessageResource>(
    `/api/post/${id}`,
    MessageResourceSchema,
  );
  return unwrapOrThrow(r);
}
