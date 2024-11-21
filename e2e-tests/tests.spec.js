// @ts-check
import { test, expect } from "@playwright/test";

const userCredentials = {
  username: "user1",
  name: "User1",
  password: "password",
  confirmPassword: "password",
};

const anotherUserCredentials = {
  username: "user2",
  name: "User2",
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

  test("Try to create user with invalid username", async ({
    page,
    request,
  }) => {
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
      "a",
      userCredentials.password,
      userCredentials.confirmPassword
    );

    await page.getByTestId("sign-up-submit-button").click();

    await expect(
      page.getByText("Username must be at least 4 characters long!")
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("Try to create user with invalid password", async ({
    page,
    request,
  }) => {
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

    await typeCredentials(page, "test", "pass", "pass");

    await page.getByTestId("sign-up-submit-button").click();

    await expect(
      page.getByText("Password must be at least 6 characters long!")
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("Create a new user", async ({ page, request }) => {
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

  test("Try to create same user twice", async ({ page, request }) => {
    await page.getByTestId("sign-up-button").click();

    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password,
      userCredentials.confirmPassword
    );

    await page.getByTestId("sign-up-submit-button").click();

    await expect(page.getByText("Username already exists!")).toBeVisible({
      timeout: 10000,
    });
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

  test("Add a new contact", async ({ page, request }) => {
    await request.post("http://localhost:4000/", {
      data: {
        query: `
        mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
          createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
            username
          }
        }
        `,
        variables: anotherUserCredentials,
      },
    });

    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password
    );

    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );

    await page.getByTestId("contacts-button").click();

    await page.getByTestId("new-contact-button").click();

    await page
      .getByTestId(`contact-${anotherUserCredentials.username}`)
      .click();

    await page.getByTestId("add-new-contacts-button").click();

    await expect(
      page.getByText(anotherUserCredentials.name, { exact: true })
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("Start a private chat", async ({ page, request }) => {
    await request.post("http://localhost:4000/", {
      data: {
        query: `
        mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
          createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
            username
          }
        }
        `,
        variables: anotherUserCredentials,
      },
    });

    await page.pause();

    await typeCredentials(
      page,
      userCredentials.username,
      userCredentials.password
    );

    await page.getByTestId("sign-in-button").click();

    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );

    await page.getByTestId("new-chat-button").click();

    await page.getByTestId("new-private-chat-button").click();

    await page
      .getByTestId(`contact-${anotherUserCredentials.username}`)
      .click();

    await page.getByTestId("start-new-private-chat-button").click();

    await expect(
      page.getByText(`You, ${anotherUserCredentials.name}`)
    ).toBeVisible({
      timeout: 10000,
    });

    const newMessageInput = await page.getByTestId("new-message-input");
    await newMessageInput.fill("Hello!");

    await page.getByTestId("send-new-message-button").click();

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible({
      timeout: 10000,
    }); // Check if message shows in chat window

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible({
      timeout: 10000,
    }); // Check if message shows in chats list
  });
});
