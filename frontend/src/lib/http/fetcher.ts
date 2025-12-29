function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function getString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export const fetchDataFromApi = async <T>(url: string): Promise<T> => {
  const r = await fetch(url);

  let j: unknown;
  try {
    j = await r.json();
  } catch {
    throw new Error('サーバー応答の形式が不正です。');
  }

  if (!isRecord(j)) {
    throw new Error('API 応答形式が不正です。');
  }

  const ok = j.ok;
  if (typeof ok !== 'boolean') {
    throw new Error('API 応答形式が不正です。');
  }

  // ok:false → message を優先して投げる
  if (!ok) {
    const message = getString(j.message) ?? '取得に失敗しました';
    throw new Error(message);
  }

  // ok:true → data の存在を最低限保証（undefined は契約違反として扱う）
  if (!('data' in j)) {
    throw new Error('API 応答形式が不正です。');
  }

  return (j as { data: T }).data;
};
