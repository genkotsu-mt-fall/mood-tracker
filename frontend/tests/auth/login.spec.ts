import test, { expect } from '@playwright/test';
import {
  visitLogin,
  fillLoginForm,
  submitLoginForm,
  loginAsE2EUser,
} from './helpers';
import { LOGIN_MESSAGES } from './messages';
import { getEmailField, getPasswordField, getFormError } from './selectors';

test.describe('Login page', () => {
  test('redirects to /feed on successful login', async ({ page }) => {
    await loginAsE2EUser(page);

    // URL が /feed になっていること
    await expect(page).toHaveURL('/feed');

    // ログインフォームがもう表示されていないことを軽くチェック
    await expect(getEmailField(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'ログイン' })).toHaveCount(0);
  });

  // /login?just_signed_up=1 でサインアップ完了メッセージが出る
  test('shows signup message when just_signed_up=1', async ({ page }) => {
    await visitLogin(page, { justSignedUp: true });

    await expect(page.getByText(LOGIN_MESSAGES.signupComplete)).toBeVisible();
  });

  // email / password 両方空で submit すると Zod のバリデーションエラーが出る
  test('shows validation errors when email and password are empty', async ({
    page,
  }) => {
    await visitLogin(page);

    await submitLoginForm(page);

    await expect(page.getByText(LOGIN_MESSAGES.emailInvalid)).toBeVisible();
    await expect(page.getByText(LOGIN_MESSAGES.passwordRequired)).toBeVisible();

    await expect(page).toHaveURL('/login');
  });

  // email は正しく、password が空のとき password だけ必須エラーになる
  test('shows password required error when only password is empty', async ({
    page,
  }) => {
    await visitLogin(page);

    await fillLoginForm(page, { email: 'user@example.com' });
    await submitLoginForm(page);

    await expect(page.getByText(LOGIN_MESSAGES.passwordRequired)).toBeVisible();

    // email 側のエラーは出ていないこと
    await expect(page.getByText(LOGIN_MESSAGES.emailInvalid)).toHaveCount(0);

    await expect(page).toHaveURL('/login');
  });

  // パスワードの Show/Hide ボタンでマスキングが切り替わる
  test('toggles password visibility with show/hide button', async ({
    page,
  }) => {
    await visitLogin(page);

    const passwordInput = getPasswordField(page);
    await passwordInput.fill('secret123');

    // 初期はマスキングされている
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 「パスワードを表示」を押すと type="text" になる
    const showButton = page.getByRole('button', {
      name: 'パスワードを表示',
    });
    await showButton.click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 「パスワードを隠す」で元に戻る
    const hideButton = page.getByRole('button', {
      name: 'パスワードを隠す',
    });
    await hideButton.click();

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // wrong パスワードのときフォームエラーが表示される
  test('shows error message on wrong password', async ({ page }) => {
    await visitLogin(page);

    await fillLoginForm(page, {
      email: 'e2e@example.com',
      password: 'wrong',
    });
    await submitLoginForm(page);

    const formError = getFormError(page);
    await expect(formError).toBeVisible({ timeout: 15000 });
    // await expect(page.getByText(LOGIN_MESSAGES.wrongPassword)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
