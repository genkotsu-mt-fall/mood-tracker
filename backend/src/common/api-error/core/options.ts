import { HttpStatus } from '@nestjs/common';
import { ApiErrorMapperOptions } from './types';
import {
  isProduction,
  buildDevDetails,
  defaultCodeForStatus,
} from 'src/common/errors/error.util';

/**
 * getProp:
 * unknown な値から安全にプロパティを取得するユーティリティ。
 *
 * - null/undefined へのプロパティアクセスは実行時エラーになるため先に弾く
 * - プリミティブ（string/number/...）は基本対象外にする（思わぬボクシング挙動を避けるため）
 * - object / function のみを許可（関数もプロパティを持つため）
 * - in 演算子は右辺が object 以外だと例外になりうるため、単純なブラケットアクセスに統一
 */
export function getProp(obj: unknown, key: string): unknown {
  // null/undefined の早期リターン：ここを通さないと次のアクセスで落ちる
  if (obj == null) return undefined;

  const t = typeof obj;

  // プリミティブ（string/number/boolean/symbol/bigint）は対象外
  // ※ プリミティブに対するプロパティ読み取りは JS 的に未定義やボクシングが絡み、意図せぬ結果になりやすい
  if (t !== 'object' && t !== 'function') return undefined;

  // ここまで来れば安全にプロパティ参照できる
  return (obj as Record<string, unknown>)[key];
}

/**
 * coerceMessage:
 * unknown を「表示用メッセージ文字列」に丸める（ESLint no-base-to-string 対応）。
 * - プリミティブだけに String(v) を使う（型を十分に狭めてから）
 * - オブジェクトは JSON.stringify を試し、失敗時は Object#toString にフォールバック
 * - function はソース露出を避けてマスク
 */
export function coerceMessage(v: unknown): string | undefined {
  if (v == null) return undefined;

  // 1) まず typeof で十分に絞る（ここでだけ String を使う）
  if (typeof v === 'string') return v; // そのまま返せる最良ケース
  if (
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'bigint' ||
    typeof v === 'symbol'
  ) {
    return String(v); // ← プリミティブに限定されているので no-base-to-string に引っかからない
  }

  // 2) function はソース文字列が出ないようにマスク
  if (typeof v === 'function') {
    const name = v.name;
    return name ? `[Function: ${name}]` : '[Function]';
  }

  // 3) object 系：Error/エラー風は message を最優先
  //    ここで String(v) を呼ばないのがポイント（no-base-to-string 回避）
  if (typeof v === 'object') {
    const nested = getProp(v, 'message'); // ダックタイピングで { message: string } を拾う
    if (typeof nested === 'string') return nested;

    try {
      const json = JSON.stringify(v);
      if (typeof json === 'string') return json;
    } catch {
      // 循環参照など stringify 不能
    }

    // 最後の砦：型名つきのタグ文字列（[object Object] 等）を明示的に生成
    // （String(v) ではなく Object.prototype.toString を使うので no-base-to-string に抵触しない）
    return Object.prototype.toString.call(v) as string;
  }

  // 到達しないはずだが、型将来変更に備えた保険
  return 'Unknown value';
}

/** 任意値を string[] に正規化（配列なら各要素を coerce、空文字は除外） */
function toStringArray(v: unknown): string[] | null {
  const out: string[] = [];
  const push = (s: string | undefined) => {
    if (typeof s !== 'string') return;
    const t = s.trim();
    if (t) out.push(t);
  };

  if (Array.isArray(v)) {
    for (const x of v) push(coerceMessage(x));
  } else if (typeof v === 'string') {
    push(v);
  } else {
    push(coerceMessage(v));
  }

  return out.length ? out : null;
}

/** fields を安全に Record<string, string[]> に正規化（不正形は捨てる） */
function normalizeFields(v: unknown): Record<string, string[]> | null {
  if (v == null || typeof v !== 'object') return null;

  const out: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(v as Record<string, unknown>)) {
    const arr = toStringArray(val);
    if (arr) out[key] = arr;
  }
  return Object.keys(out).length ? out : null;
}

export const defaultOptions: Required<ApiErrorMapperOptions> = Object.freeze({
  isProd: () => isProduction(),
  extractMessage: (payload, exception) => {
    // 1) まず payload.message を取り出す
    const m = getProp(payload, 'message');

    // 2) 配列だったら、要素を安全に string 化し、空要素は除去した上で join
    let msgFromArray: string | undefined;
    if (Array.isArray(m)) {
      const parts = m.map(coerceMessage).filter(Boolean) as string[];
      msgFromArray = parts.length ? parts.join(', ') : undefined;
    }

    // 3) 決定順序：
    //   - 配列→join結果
    //   - 単体の message
    //   - payload.error
    //   - 例外自身の message
    //   - 何も無ければ既定文
    const msgRaw =
      msgFromArray ??
      coerceMessage(!Array.isArray(m) ? m : undefined) ??
      coerceMessage(getProp(payload, 'error')) ??
      coerceMessage(getProp(exception, 'message')) ??
      'Unknown error';

    return msgRaw;
  },

  extractFields: (payload) => {
    if (!payload) return null;

    const fields = normalizeFields(getProp(payload, 'fields'));
    if (fields) return fields;

    // const msgArr = toStringArray(getProp(payload, 'message'));
    // if (msgArr) return { global: msgArr };
    // ← バリデーション系で message が配列のときだけ補完する
    const m = getProp(payload, 'message');
    if (Array.isArray(m)) {
      const msgArr = toStringArray(m);
      if (msgArr) return { global: msgArr };
    }

    return null;
  },

  codeForStatus: (status) => defaultCodeForStatus(status),

  defaultStatus: HttpStatus.INTERNAL_SERVER_ERROR,

  buildDevDetails: (e) => buildDevDetails(e),

  includeCause: true,
});

export function resolveProdFlag(
  isProd: Required<ApiErrorMapperOptions>['isProd'],
): boolean {
  return typeof isProd === 'function' ? !!isProd() : !!isProd;
}
