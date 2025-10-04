export const fetchDataFromApi = async <T>(url: string): Promise<T> => {
  const r = await fetch(url);
  const j = await r.json();
  if (!j.success) throw new Error(j.message || '取得に失敗しました');
  return j.data as T;
};
