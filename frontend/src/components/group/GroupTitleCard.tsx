'use client';

import { useEffect, useState } from 'react';

export default function GroupTitleCard({
  name,
  onNameChange,
  editable = true,
}: {
  name: string;
  onNameChange?: (value: string) => void; // 未来のPUT実装用（任意）
  editable?: boolean;
}) {
  const [local, setLocal] = useState(name);

  // 取得後にnameが変わった場合に同期
  useEffect(() => setLocal(name), [name]);

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3">
      <label className="block text-xs text-gray-500">グループ名</label>
      <input
        className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onNameChange?.(e.target.value);
        }}
        disabled={!editable}
      />
      <div className="mt-2 text-right text-xs text-gray-500">
        保存は後でAPI実装
      </div>
    </div>
  );
}
