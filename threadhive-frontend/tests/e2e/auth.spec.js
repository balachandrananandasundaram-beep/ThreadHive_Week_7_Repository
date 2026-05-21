import { test, expect } from "@playwright/test";

// Generate a unique email per test run so repeated runs don't collide
const timestamp = Date.now();
const TEST_USER = {
  name: `Test User ${timestamp}`,
  email: `testuser${timestamp}@example.com`,
  password: "Password123!",
};

test.describe("ThreadHive – Authentication flow", () => {
  // ─── 1. Registration ───────────────────────────────────────────────────────
  test("new user can register and is redirected to login page", async ({
    page,
  }) => {
    await page.goto("/register");

    // Page should show the Register heading
    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

    // Fill in the registration form
    await page.getByLabel("Name").fill(TEST_USER.name);
    await page.getByLabel("Email").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);

    // Accept the "Registration successful!" alert, then submit
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("button[type='submit']").click();

    // After accepting the alert the app navigates to /login
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  // ─── 2. Login ──────────────────────────────────────────────────────────────
  test("registered user can log in and is redirected to home page", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    // Fill in credentials
    await page.getByLabel("Email").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.locator("button[type='submit']").click();

    // After login the app navigates to "/" which redirects to /home
    await expect(page).toHaveURL(/\/home$/);

    // Header should now show the user's name and a Logout button
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
    await expect(page.getByRole("button", { name: /Logout/i })).toBeVisible();
  });

  // ─── 3. Logout ─────────────────────────────────────────────────────────────
  test("logged-in user can log out and is redirected to login page", async ({
    page,
  }) => {
    // ── Log in first ──────────────────────────────────────────────────────
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.locator("button[type='submit']").click();
    await expect(page).toHaveURL(/\/home$/);

    // ── Now log out ───────────────────────────────────────────────────────
    await page.getByRole("button", { name: /Logout/i }).click();

    // Should land on /login
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    // Header should no longer show the Logout button
    await expect(
      page.getByRole("button", { name: /Logout/i })
    ).not.toBeVisible();

    // Login and Register buttons should be visible again
    await expect(
      page.getByRole("button", { name: /^Login$/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Register$/i })
    ).toBeVisible();
  });
});
