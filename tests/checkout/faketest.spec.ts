import { test } from "../../fixtures/baseTest";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.login("standard_user", "secret_sauce");
});

test("Failing test", async ({ inventoryPage }) => {
  await inventoryPage.navigateToInventoryPage();
  await inventoryPage.sortItems("Name (A to Z)");
  await inventoryPage.assertItemSorting("[data-test='inventory-item-name']", "name", "desc");
});
