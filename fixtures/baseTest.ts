import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { ProductPage } from '../pages/product/ProductPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';

type MyFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';