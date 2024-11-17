// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Messaging app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Page has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Messaging App/);
  });
});
