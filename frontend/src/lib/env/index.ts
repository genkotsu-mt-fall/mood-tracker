import 'server-only';

/** 必須環境変数を取り出し、未設定なら例外 */
export function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

/** APIのベースURLを取得（共通） */
export function getApiBaseUrl(): string {
  return requiredEnv('API_BASE_URL');
}
