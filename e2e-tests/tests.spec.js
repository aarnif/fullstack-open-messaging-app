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

  test.afterAll(async ({ request }) => {
    await request.post("http://localhost:4000/", {
      data: {
        query: `
        mutation Mutation {
          resetDatabase
        }
        `,
      },
    });
  });

  test("Page has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Messaging App/);
  });

  test("Sign up with a new user", async ({ page }) => {
    const signUpButton = await page.getByTestId("sign-up-button");
    await signUpButton.click();

    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password,
      userCredentials.confirmPassword
    );

    const signUpSubmitButton = await page.getByTestId("sign-up-submit-button");
    await signUpSubmitButton.click();

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();
  });
});
