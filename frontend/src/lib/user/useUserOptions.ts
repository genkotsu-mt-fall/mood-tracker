'use client';
import useSWR from 'swr';
import { UserData } from './api';

const fetchJson = async <T>(url: string): Promise<T> => {
  const r = await fetch(url);
  const j = await r.json();
  if (!j.success) throw new Error(j.message || '取得に失敗しました');
  return j.data;
};

export function useUserOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user',
    fetchJson<UserData[]>,
  );

  const options = (data ?? []).map((user: UserData) => ({
    id: user.id,
    label: user.name || user.email,
  }));

  return { options, error: error as Error | undefined, isLoading, mutate };
}
