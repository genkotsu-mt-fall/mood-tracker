import type { HttpJsonResult } from './json';

export type Ok<T> = { ok: true; data: T };
export type Fail = {
  ok: false;
  message: string;
  fields?: Record<string, string[]>;
};

export function toOkFail<T>(res: HttpJsonResult<T>): Ok<T> | Fail {
  if (res.ok) {
    return { ok: true, data: res.json.data };
  }

  let fields: Record<string, string[]> | undefined;
  if ('json' in res && res.json) {
    fields = res.json.error.fields;
  }
  return { ok: false, message: res.message, fields };
}
