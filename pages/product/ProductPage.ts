import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly sortButton: Locator;
  readonly inventoryItem: (itemName: string) => Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemDescription: Locator;
  readonly inventoryItemPrice: Locator;

  constructor(readonly page: Page) {
    this.sortButton = page.locator("[data-test='product-sort-container']");
    this.inventoryItem = (itemName: string) =>
      page.locator(`[data-sku]:has-text("${itemName}")`);
    this.inventoryItemName = page.locator("[data-test='inventory-item-name']");
    this.inventoryItemDescription = page.locator(
      "[data-test='inventory-item-desc']",
    );
    this.inventoryItemPrice = page.locator(
      "[data-test='inventory-item-price']",
    );
  }

  async navigateToProductPage() {
    await this.page.goto("/?signin=true");
  }

  async addItemToCart(itemName: string) {
    await this.inventoryItem(itemName)
      .getByText("Add to cart")
      .click();
  }

  async clickCheckout() {
    await this.page.getByText("Checkout")
      .click();
  }

  // async sortItems(sortBy: string) {
  //   await this.sortButton.selectOption(sortBy);
  // }

  // async assertItemSorting(
  //   selector: string,
  //   type: string,
  //   order: "asc" | "desc" = "asc",
  // ) {
  //   const elements = await this.page.locator(selector).elementHandles();
  //   const actualValues = await Promise.all(
  //     elements.map(async (el) => {
  //       const text = (await el.innerText()).trim();

  //       if (type === "price") {
  //         return Number(text.replace("$", ""));
  //       }

  //       if (type === "name") {
  //         return text;
  //       }

  //       return text;
  //     }),
  //   );

  //   const sortedValues = [...actualValues].sort((a, b) => {
  //     if (type === "price") {
  //       return order === "asc"
  //         ? (a as number) - (b as number)
  //         : (b as number) - (a as number);
  //     }

  //     if (type === "name") {
  //       return order === "asc"
  //         ? (a as string).localeCompare(b as string)
  //         : (b as string).localeCompare(a as string);
  //     }

  //     return 0;
  //   });

  //   actualValues.forEach((value, index) => {
  //     expect(value).toBe(sortedValues[index]);
  //   });
  // }

  // async addItemToCart(itemName: string) {
  //   await this.inventoryItem(itemName)
  //     .locator('button:has-text("Add to cart")')
  //     .click();
  // }

  // async assertInventoryPage() {
  //   await expect(this.page).toHaveURL("/");
  // }

  // async clickItem(itemName: string) {
  //   await this.inventoryItem(itemName)
  //     .locator('button:has-text("Add to cart")')
  //     .click();
  // }

  // async assertItemDetailPage() {
  //   await expect(this.page).toHaveURL(/\/inventory-item.html\?id=/);
  // }

  // async assertItemDetails(itemDetails: { name: string; description: string; price: number }) {
  //   await expect(this.inventoryItemName).toHaveText(itemDetails.name);
  //   await expect(this.inventoryItemDescription).toHaveText(itemDetails.description);
  //   await expect(this.inventoryItemPrice).toHaveText(`$${itemDetails.price}`);
  // }

  // async clickAddToCartOnDetailPage() {
  //   await this.page.locator('button:has-text("Add to cart")').click();
  // }

  // async clickOnBackToProducts() {
  //   await this.page.locator('button:has-text("Back to products")').click();
  // }

}
