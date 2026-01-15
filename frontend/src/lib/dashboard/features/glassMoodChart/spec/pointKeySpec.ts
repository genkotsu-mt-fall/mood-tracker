export type PointKey = string;

/**
 * 「この点を何で一意に識別するか」を外から注入するための契約
 * - まずは key === time（現状互換）
 * - 将来は key === id などに差し替える
 */
export type PointKeySpec<T> = {
  getKey: (p: T) => PointKey;
};

/** 現状互換：time を key として使う */
export function createTimeKeySpec<
  T extends { time: string },
>(): PointKeySpec<T> {
  return {
    getKey: (p) => p.time,
  };
}
