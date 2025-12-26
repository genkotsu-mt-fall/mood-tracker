export const LOGIN_MESSAGES = {
  signupComplete:
    'アカウントを作成しました。メールアドレスとパスワードでログインしてください。',
  emailInvalid: 'メールアドレスの形式が不正です。',
  passwordRequired: 'パスワードを入力してください。',
  wrongPassword: 'メールアドレスまたはパスワードが正しくありません',
};

export const SIGNUP_MESSAGES = {
  emailInvalid: LOGIN_MESSAGES.emailInvalid,
  passwordMinLength: 'パスワードは8文字以上で入力してください。',
  confirmRequired: '確認用パスワードを入力してください。',
  passwordMismatch: 'パスワードと確認用パスワードが一致しません。',

  duplicateEmail: 'このメールアドレスは既に登録されています。',
  invalidServerResponse: 'サーバー応答の形式が不正です。',
};
