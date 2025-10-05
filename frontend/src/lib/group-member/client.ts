export async function createGroupMemberClient(
  groupId: string,
  memberIds: string[],
): Promise<void> {
  for (const memberId of memberIds) {
    const r = await fetch('/api/group-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId, memberId }),
    });

    const j = await r.json();
    if (!r.ok || !('success' in j) || !j.success) {
      const message = j.message || 'グループの作成に失敗しました';
      throw new Error(message);
    }
  }
}
