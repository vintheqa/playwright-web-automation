import { test } from "../../fixtures/baseTest";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.login("standard_user", "secret_sauce");
});

test("User should be able to sort items by name", async ({ inventoryPage }) => {
  await inventoryPage.navigateToInventoryPage();
  await inventoryPage.sortItems("Name (A to Z)");
  await inventoryPage.assertItemSorting("[data-test='inventory-item-name']", "name", "asc");
});
