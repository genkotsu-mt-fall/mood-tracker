export const addDays = (days: number) =>
  /**
   * new Date(): Dateオブジェクト
   * Date.now(): numer (ミリ秒)
   */
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
