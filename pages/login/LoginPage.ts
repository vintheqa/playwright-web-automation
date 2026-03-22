import { Page, Locator, expect } from "@playwright/test";
import { interceptResponse } from "../../utils/apiInterceptor";

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.locator('[id="username"]').locator("input");
    this.passwordInput = page.locator('[id="password"]').locator("input");
    this.loginButton = page.locator('[id="login-btn"]');
  }

  async goToLoginPage() {
    await this.page.goto("/signin");
  }

  async loginViaAPI(username: string, password: string) {
    await this.page.goto('/');
    const response = await this.page.request.post("/api/signin", {
      data: { userName: username, password },
    });
    
    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}`);
    }

    await this.page.reload();
    
    // this.page.goto("/?signin=true");
    return response;
  }

  async login(username: string, password: string) {
    await this.goToLoginPage();
    await this.usernameInput.fill(username);
    await this.usernameInput.press("Enter");
    await this.passwordInput.fill(password);
    await this.passwordInput.press("Enter");
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await interceptResponse(this.page, "**/api/signin", {
      method: "POST",
      status: 200,
    });
    await expect(this.page).toHaveURL("/?signin=true");
  }

  async assertLoggedOutState() {
    await expect(this.page).not.toHaveURL("/?signin=true");
  }

  async assertLoginErrorMsg(errMsg: string) {
      await interceptResponse(this.page, "**/api/signin", {
      method: "POST",
      status: (s) => s !== 200,
    });
    await this.page.getByText(errMsg).waitFor();
  }
}
