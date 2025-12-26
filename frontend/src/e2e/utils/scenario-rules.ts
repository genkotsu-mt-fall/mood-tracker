/** E2E の“合言葉”集：この入力ならこの結果にする */
export const e2eScenarioRules = {
  login: {
    wrongPassword: 'wrong',
  },
  signup: {
    // このメールアドレスなら「既に登録されています」系のエラーにする
    duplicateEmail: 'conflict@example.com',
    // このメールアドレスならレスポンス JSON の schema をあえて壊す
    schemaErrorEmail: 'schema-error@example.com',
  },
  // post:   { invalidBody: '<<INVALID>>' },
} as const;

export type E2EScenarioRules = typeof e2eScenarioRules;
