import { test } from "../../fixtures/baseTest";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.setSessionUser("demouser");
});

test("User should be able to checkout an item", async ({
  productPage,
  checkoutPage,
}) => {
  await productPage.navigateToProductPage();
  await productPage.addItemToCart("iPhone 12 Pro Max");
  await productPage.clickCheckout();
  await checkoutPage.fillCheckoutForm(
    "John",
    "Doe",
    "123 Main St",
    "CA",
    "12345",
  );
  await checkoutPage.assertCheckoutSuccess();
});
