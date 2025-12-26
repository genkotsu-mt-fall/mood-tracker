import test, { expect } from '@playwright/test';
import {
  fillSignupForm,
  signupAndRedirectToFeed,
  submitSignupForm,
  visitSignup,
} from './helpers';
import { getSignupFormError, getSignupHeading } from './selectors';
import { SIGNUP_MESSAGES } from './messages';
import { e2eScenarioRules } from '@/e2e/utils/scenario-rules';

test.describe('Signup page', () => {
  // 正常系：サインアップ成功 → 自動ログイン → /feed へリダイレクト
  test('redirects to /feed on successful signup', async ({ page }) => {
    await signupAndRedirectToFeed(page);

    await expect(page).toHaveURL('/feed');

    // サインアップフォームが表示されていないことを軽くチェック
    await expect(getSignupHeading(page)).toHaveCount(0);
  });

  // Zod バリデーション：必須項目が空のときエラーが出る
  test('shows validation errors when required fields are empty', async ({
    page,
  }) => {
    await visitSignup(page);

    await submitSignupForm(page);

    await expect(page.getByText(SIGNUP_MESSAGES.emailInvalid)).toBeVisible();
    await expect(
      page.getByText(SIGNUP_MESSAGES.passwordMinLength),
    ).toBeVisible();
    await expect(page.getByText(SIGNUP_MESSAGES.confirmRequired)).toBeVisible();

    await expect(page).toHaveURL('/signup');
  });

  // Zod バリデーション：パスワードと確認用パスワードが一致しない
  test('shows error when password and confirm do not match', async ({
    page,
  }) => {
    await visitSignup(page);

    await fillSignupForm(page, {
      email: 'user@example.com',
      password: 'password1234',
      confirm: 'different1234',
    });

    await submitSignupForm(page);

    await expect(
      page.getByText(SIGNUP_MESSAGES.passwordMismatch),
    ).toBeVisible();

    await expect(page).toHaveURL('/signup');
  });

  // 異常系：ユニークキー重複
  test('shows duplicate email error from server', async ({ page }) => {
    await visitSignup(page);

    await fillSignupForm(page, {
      email: e2eScenarioRules.signup.duplicateEmail,
      password: 'password1234',
      confirm: 'password1234',
    });

    await submitSignupForm(page);

    await expect(getSignupFormError(page)).toHaveText(
      SIGNUP_MESSAGES.duplicateEmail,
    );
    await expect(page).toHaveURL('/signup');
  });

  // 異常系：レスポンス JSON の schema が不正
  test('shows error when server response schema is invalid', async ({
    page,
  }) => {
    await visitSignup(page);

    await fillSignupForm(page, {
      email: e2eScenarioRules.signup.schemaErrorEmail,
      password: 'password1234',
      confirm: 'password1234',
    });
    await submitSignupForm(page);

    await expect(getSignupFormError(page)).toHaveText(
      SIGNUP_MESSAGES.invalidServerResponse,
    );
    await expect(page).toHaveURL('/signup');
  });
});
