import { PROTECTED_PREFIXES } from '@/constants/protected-prefixes';

export function safeReturnTo(
  raw: unknown,
  opts?: {
    maxLength?: number;
    decodeRounds?: number;
    allowedPrefixes?: readonly string[];
  },
): string | undefined {
  const { maxLength = 1024, decodeRounds = 2 } = opts ?? {};
  const allowedPrefixes = [
    ...PROTECTED_PREFIXES,
    ...(opts?.allowedPrefixes ?? []),
  ];

  // 1) 前後空白の混入（CR/LF含む）を禁止：そのまま使える形だけ通す
  if (typeof raw !== 'string') return undefined;
  if (!raw) return undefined;
  if (raw.length > maxLength) return undefined;

  // そのまま使える形だけ通す
  if (raw !== raw.trim()) return undefined;

  const v = raw;

  // 2) C0/C1制御文字やBidi制御の混入を拒否（ヘッダ分割/視覚順序トリック対策）
  //    C0: \u0000-\u001F, DEL: \u007F, Bidi: \u202A-\u202E, Isolates: \u2066-\u2069, LRM/RLM: \u200E\u200F
  const CONTROL_OR_BIDI =
    /[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069\u200E\u200F\u200B\u200C\u200D\u2060\u2028\u2029]/;
  if (CONTROL_OR_BIDI.test(v)) return undefined;

  // 3) 絶対URL/スキーム付き禁止（http:, https:, javascript:, data: など全般）
  const ABS_SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
  if (ABS_SCHEME_RE.test(v)) return undefined;

  // 4) 相対パスのみ許可：先頭は "/"、ただし "//"（プロトコル相対）は拒否
  if (!v.startsWith('/')) return undefined;
  if (v.startsWith('//')) return undefined;

  // 5) バックスラッシュ禁止（環境差によるパス解釈ズレを防止）
  if (v.includes('\\')) return undefined;

  // 6) 多重%デコード（最大 decodeRounds 回）。不正%があれば即拒否。
  const multiDecode = (s: string, times = 2) => {
    let cur = s;
    for (let i = 0; i < times; i++) {
      try {
        const dec = decodeURIComponent(cur);
        if (dec === cur) break;
        cur = dec;
      } catch {
        return undefined;
      }
    }
    return cur;
  };
  const decoded = multiDecode(v, decodeRounds);
  if (decoded === undefined) return undefined;

  // 7) デコード後も再チェック
  if (CONTROL_OR_BIDI.test(decoded)) return undefined;
  if (ABS_SCHEME_RE.test(decoded)) return undefined;
  if (!decoded.startsWith('/')) return undefined;
  if (decoded.startsWith('//')) return undefined;
  if (decoded.includes('\\')) return undefined;

  // 8) パストラバーサル抑止、ドットセグメント拒否
  if (
    decoded.includes('/./') ||
    decoded.includes('/../') ||
    decoded.endsWith('/..') ||
    decoded.endsWith('/.')
  )
    return undefined;

  // 9) 許可プレフィックスでさらに絞る
  const pathOnly = decoded.split(/[?#]/, 1)[0];
  const ok = allowedPrefixes.some(
    (p) => pathOnly === p || pathOnly.startsWith(p + '/'),
  );
  if (!ok) return undefined;

  // 9) ここまで通れば「アプリ内の安全な相対パス」と判断
  return decoded;
}
