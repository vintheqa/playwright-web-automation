import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async goToLoginPage() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL("/inventory.html");
  }

  async assertLoggedOutState() {
    await expect(this.page).not.toHaveURL("/inventory.html");
  }

  async assertLoginErrorMsg(errMsg: string) {
    await this.page.getByText(errMsg).waitFor();
  }
}
