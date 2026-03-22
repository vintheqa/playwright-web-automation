import { Page, Locator, expect } from "@playwright/test";
import { interceptResponse } from "../../utils/apiInterceptor";

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly provinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.firstNameInput = page.locator("[id='firstNameInput']");
    this.lastNameInput = page.locator("[id='lastNameInput']");
    this.addressInput = page.locator("[id='addressLine1Input']");
    this.provinceInput = page.locator("[id='provinceInput']");
    this.postalCodeInput = page.locator("[id='postCodeInput']");
    this.submitButton = page.locator("[id='checkout-shipping-continue']");
  }

  async fillCheckoutForm(firstName: string, lastName: string, address: string, province: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.provinceInput.fill(province);
    await this.postalCodeInput.fill(postalCode);
    await this.submitButton.click();
  }

  async assertCheckoutSuccess() {
        await interceptResponse(this.page, "**/api/checkout", {
          method: "POST",
          status: 200,
        });
    await expect(this.page.getByText("Your Order has been successfully placed")).toBeVisible();
  }
}
