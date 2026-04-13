/**
 * Playwright — Login Flow Test
 *
 * The same login flow as the Selenium baseline, rewritten in Playwright.
 * Demonstrates the reduction in ceremony:
 *   - No explicit waits — Playwright auto-waits for elements
 *   - No driver lifecycle — Playwright manages browser context per test
 *   - Locator-based API with built-in assertions
 *   - Half the lines of code for identical coverage
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - npx playwright install (downloads browser binaries)
 *   - npm install (installs @playwright/test)
 *
 * Run:
 *   npx playwright test playwright/login-flow.spec.js
 */

const { test, expect } = require("@playwright/test");

const BASE_URL = "https://practicetestautomation.com/practice-test-login/";
const VALID_USERNAME = "student";
const VALID_PASSWORD = "Password123";

test.describe("Login Flow (Playwright)", () => {
  test("should log in with valid credentials and reach the success page", async ({ page }) => {
    await page.goto(BASE_URL);

    // Fill in credentials — no explicit waits needed
    await page.locator("#username").fill(VALID_USERNAME);
    await page.locator("#password").fill(VALID_PASSWORD);
    await page.locator("#submit").click();

    // Verify the success page loaded
    const heading = page.locator(".post-title");
    await expect(heading).toContainText("Logged In Successfully", { ignoreCase: true });

    // Verify the congratulations message
    const successMessage = page.locator(".has-text-align-center strong");
    await expect(successMessage).toContainText("Congratulations", { ignoreCase: true });
  });

  test("should show an error for invalid credentials", async ({ page }) => {
    await page.goto(BASE_URL);

    // Fill in invalid credentials
    await page.locator("#username").fill("wronguser");
    await page.locator("#password").fill("wrongpassword");
    await page.locator("#submit").click();

    // Verify the error message appears
    const errorMessage = page.locator("#error");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Your username is invalid", { ignoreCase: true });
  });
});
