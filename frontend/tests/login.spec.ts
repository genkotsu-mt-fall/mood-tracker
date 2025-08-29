import test, { expect } from "@playwright/test";

// ログイン成功でトップへ遷移
test("should redirect to home on successful login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/", { timeout: 15000 });
  await expect(page.getByLabel("Email")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Log in" })).toHaveCount(0);
});

// ログイン失敗でエラー表示
test("should display error on failed login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(`test-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.locator("#form-error")).toHaveText(
    /(メールまたはパスワードが違います|Login failed(?:.*)?)/,
    { timeout: 15000 }
  );
  await expect(page).toHaveURL("/login");
});
