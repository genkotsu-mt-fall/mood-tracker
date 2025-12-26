import { Page, Locator } from '@playwright/test';

/* ---------- 共通 / login 用 ---------- */

export const getEmailField = (page: Page): Locator =>
  page.getByLabel('メールアドレス', { exact: true });

export const getPasswordField = (page: Page): Locator =>
  page.getByLabel('パスワード', { exact: true });

export const getLoginButton = (page: Page): Locator =>
  page.getByRole('button', { name: 'ログイン' });

export const getLoginPendingButton = (page: Page): Locator =>
  page.getByRole('button', { name: 'ログイン中...' });

export const getFormError = (page: Page): Locator =>
  page.locator('#form-error[role="alert"]');

/* ---------- signup 用 ---------- */

export const getSignupNameField = (page: Page): Locator =>
  page.getByLabel('名前（任意）', { exact: true });

export const getSignupEmailField = (page: Page): Locator => getEmailField(page);

export const getSignupPasswordField = (page: Page): Locator =>
  getPasswordField(page);

export const getSignupConfirmPasswordField = (page: Page): Locator =>
  page.getByLabel('パスワード（確認）', { exact: true });

export const getSignupButton = (page: Page): Locator =>
  page.getByRole('button', { name: 'アカウント作成' });

export const getSignupPendingButton = (page: Page): Locator =>
  page.getByRole('button', { name: '作成中...' });

export const getSignupFormError = (page: Page): Locator => getFormError(page);

export const getSignupHeading = (page: Page): Locator =>
  page.getByRole('heading', { name: 'アカウント作成' });
