import { Page } from '@playwright/test';
import {
  getEmailField,
  getPasswordField,
  getLoginButton,
  getSignupNameField,
  getSignupEmailField,
  getSignupPasswordField,
  getSignupConfirmPasswordField,
  getSignupButton,
} from './selectors';

/* ========== login 用 ========== */

type VisitLoginOptions = {
  justSignedUp?: boolean;
};

type FillLoginOptions = {
  email?: string;
  password?: string;
};

const E2E_LOGIN = {
  email: 'e2e@example.com',
  password: 'password123',
};

export const loginAsE2EUser = async (page: Page) => {
  await visitLogin(page);
  await fillLoginForm(page, E2E_LOGIN);
  await submitLoginForm(page);
  await page.waitForURL('/feed', { timeout: 15000 });
};

export const visitLogin = async (page: Page, options?: VisitLoginOptions) => {
  const params = new URLSearchParams();

  if (options?.justSignedUp) {
    params.set('just_signed_up', '1');
  }

  const url = params.toString() ? `/login?${params.toString()}` : '/login';
  await page.goto(url);
};

export const fillLoginForm = async (page: Page, opts: FillLoginOptions) => {
  const { email, password } = opts;

  if (email !== undefined) {
    await getEmailField(page).fill(email);
  }

  if (password !== undefined) {
    await getPasswordField(page).fill(password);
  }
};

export const submitLoginForm = async (page: Page) => {
  await getLoginButton(page).click();
};

/* ========== signup 用 ========== */

type FillSignupOptions = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

const E2E_SIGNUP_DEFAULT = {
  name: 'E2E User',
  email: `signup-${Date.now()}@example.com`,
  password: 'password1234', // 8文字以上
};

export const visitSignup = async (page: Page) => {
  await page.goto('/signup');
};

export const fillSignupForm = async (
  page: Page,
  opts: FillSignupOptions,
): Promise<void> => {
  const { name, email, password, confirm } = opts;

  if (name !== undefined) {
    await getSignupNameField(page).fill(name);
  }

  if (email !== undefined) {
    await getSignupEmailField(page).fill(email);
  }

  if (password !== undefined) {
    await getSignupPasswordField(page).fill(password);
  }

  if (confirm !== undefined) {
    await getSignupConfirmPasswordField(page).fill(confirm);
  }
};

export const submitSignupForm = async (page: Page): Promise<void> => {
  await getSignupButton(page).click();
};

/**
 * 正常系のサインアップ + 自動ログインで /feed まで行くヘルパー
 * （テストごとに email を変えたい場合はオプションで上書きして使う）
 */
export const signupAndRedirectToFeed = async (
  page: Page,
  overrides?: Partial<FillSignupOptions>,
): Promise<void> => {
  const base = E2E_SIGNUP_DEFAULT;
  const password = overrides?.password ?? base.password;

  await visitSignup(page);
  await fillSignupForm(page, {
    name: overrides?.name ?? base.name,
    email: overrides?.email ?? base.email,
    password,
    confirm: overrides?.confirm ?? password,
  });
  await submitSignupForm(page);
  await page.waitForURL('/feed', { timeout: 30000 });
};
