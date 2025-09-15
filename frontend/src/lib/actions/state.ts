export type ActionState<TFields extends string> =
  | { ok: true }
  | { ok: false; error?: string; fields?: Partial<Record<TFields, string>> };

/**
 * Zodのバリデーションエラー配列から、フォームフィールドごとのエラーメッセージオブジェクトを生成します。
 *
 * @param issueList Zodのissue配列（各issueはpathとmessageを持つ）
 * @returns フィールド名をキー、エラーメッセージを値とするオブジェクト
 *
 * pathの先頭要素（トップレベルのフィールド名）をキーとして利用します。
 * symbol型や空のpathは無視されます。
 */
export function zodToFieldErrors(
  issueList: ReadonlyArray<{
    path: ReadonlyArray<PropertyKey>;
    message: string;
  }>,
) {
  const out: Record<string, string> = {};
  for (const issue of issueList) {
    const seg = issue.path[0];
    if (seg === undefined) continue;
    if (typeof seg === 'symbol') continue;

    const key = String(seg);
    if (key) out[key] = issue.message;
  }
  return out;
}

/**
 * APIから返却されたフィールドごとのエラー配列を、UI表示用のエラーメッセージオブジェクトに変換します。
 *
 * @param apiFields APIから受け取ったフィールド名をキー、エラーメッセージ配列を値とするオブジェクト
 * @returns フィールド名をキー、エラーメッセージ（複数の場合は改行区切り）を値とするオブジェクト。エラーがなければundefined。
 */
export function apiFieldErrorsToUi(
  apiFields?: Record<string, string[]>,
): Record<string, string> | undefined {
  if (!apiFields) return;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(apiFields)) {
    if (v?.length) out[k] = v.join('\n');
  }
  return out;
}
