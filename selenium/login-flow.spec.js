/**
 * Selenium WebDriver — Login Flow Test
 *
 * A real-world Selenium test that exercises a login flow against a demo app.
 * Demonstrates the full ceremony of a production Selenium suite:
 *   - Explicit WebDriverWait + ExpectedConditions
 *   - try/finally driver cleanup
 *   - Chrome options configuration
 *   - Manual element interaction (sendKeys, click)
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - Chrome browser installed
 *   - chromedriver matching your Chrome version (or use `npx chromedriver` auto-download)
 *   - npm install (installs selenium-webdriver, mocha, chai)
 *
 * Run:
 *   npx mocha selenium/login-flow.spec.js --timeout 30000
 *
 * Note: This test targets https://practicetestautomation.com which provides
 * a stable, public login form for testing purposes.
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

const BASE_URL = "https://practicetestautomation.com/practice-test-login/";
const VALID_USERNAME = "student";
const VALID_PASSWORD = "Password123";
const TIMEOUT_MS = 10000;

describe("Login Flow (Selenium)", function () {
  this.timeout(30000);

  let driver;

  beforeEach(async function () {
    const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1280,720");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("should log in with valid credentials and reach the success page", async function () {
    // Navigate to the login page
    await driver.get(BASE_URL);

    // Wait for the username field to be present
    const usernameField = await driver.wait(
      until.elementLocated(By.id("username")),
      TIMEOUT_MS,
      "Username field not found within timeout"
    );

    // Wait for the password field to be present
    const passwordField = await driver.wait(
      until.elementLocated(By.id("password")),
      TIMEOUT_MS,
      "Password field not found within timeout"
    );

    // Wait for the submit button to be present
    const submitButton = await driver.wait(
      until.elementLocated(By.id("submit")),
      TIMEOUT_MS,
      "Submit button not found within timeout"
    );

    // Enter credentials
    await usernameField.clear();
    await usernameField.sendKeys(VALID_USERNAME);
    await passwordField.clear();
    await passwordField.sendKeys(VALID_PASSWORD);

    // Click submit
    await submitButton.click();

    // Wait for the success page to load — look for the confirmation heading
    const successHeading = await driver.wait(
      until.elementLocated(By.css(".post-title")),
      TIMEOUT_MS,
      "Success page heading not found after login"
    );

    // Verify the heading text confirms successful login
    const headingText = await successHeading.getText();
    expect(headingText.toLowerCase()).to.include("logged in successfully");

    // Verify the success message mentions the username
    const successMessage = await driver.wait(
      until.elementLocated(By.css(".has-text-align-center strong")),
      TIMEOUT_MS,
      "Success message element not found"
    );
    const messageText = await successMessage.getText();
    expect(messageText.toLowerCase()).to.include("congratulations");
  });

  it("should show an error for invalid credentials", async function () {
    // Navigate to the login page
    await driver.get(BASE_URL);

    // Wait for fields to be present
    const usernameField = await driver.wait(
      until.elementLocated(By.id("username")),
      TIMEOUT_MS
    );
    const passwordField = await driver.wait(
      until.elementLocated(By.id("password")),
      TIMEOUT_MS
    );
    const submitButton = await driver.wait(
      until.elementLocated(By.id("submit")),
      TIMEOUT_MS
    );

    // Enter invalid credentials
    await usernameField.clear();
    await usernameField.sendKeys("wronguser");
    await passwordField.clear();
    await passwordField.sendKeys("wrongpassword");

    // Click submit
    await submitButton.click();

    // Wait for the error message to appear
    const errorMessage = await driver.wait(
      until.elementLocated(By.id("error")),
      TIMEOUT_MS,
      "Error message not displayed for invalid credentials"
    );

    // Verify the error message is visible and contains expected text
    await driver.wait(
      until.elementIsVisible(errorMessage),
      TIMEOUT_MS,
      "Error message not visible"
    );
    const errorText = await errorMessage.getText();
    expect(errorText.toLowerCase()).to.include("your username is invalid");
  });
});
