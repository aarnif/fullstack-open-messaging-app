// @ts-check
import { test, expect } from "@playwright/test";

const userCredentials = {
  username: "test",
  password: "password",
  confirmPassword: "password",
};

const typeCredentials = async (
  page,
  username,
  password,
  confirmPassword = null
) => {
  const usernameInput = await page.getByTestId("username-input");
  await usernameInput.fill(username);

  const passwordInput = await page.getByTestId("password-input");
  await passwordInput.fill(password);

  if (confirmPassword) {
    const confirmPasswordInput = await page.getByTestId(
      "confirm-password-input"
    );
    await confirmPasswordInput.fill(confirmPassword);
  }
};

test.describe("Messaging app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Page has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Messaging App/);
  });

  test("Sign up with a new user", async ({ page, request }) => {
    await request.post("http://localhost:4000/", {
      data: {
        query: `
        mutation Mutation {
          resetDatabase
        }
        `,
      },
    });

    await page.getByTestId("sign-up-button").click();

    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password,
      userCredentials.confirmPassword
    );

    await page.getByTestId("sign-up-submit-button").click();

    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );
  });

  test("Sign in success with a new user", async ({ page }) => {
    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password
    );

    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );
  });

  test("Sign in fails with wrong credentials", async ({ page }) => {
    await typeCredentials(page, userCredentials.username, "wrongpassword");

    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText("invalid username or password!")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Sign out works", async ({ page }) => {
    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password
    );

    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );

    await page.getByTestId("logout-button").click();
    await page.getByTestId("confirm-button").click();
    await expect(page.getByTestId("sign-in-title")).toBeVisible({
      timeout: 10000,
    });
  });
});
