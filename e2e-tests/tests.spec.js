// @ts-check
import { test, expect } from "@playwright/test";

const userCredentials = [];

for (let i = 1; i <= 3; i++) {
  userCredentials.push({
    username: `user${i}`,
    name: `User${i}`,
    password: "password",
    confirmPassword: "password",
  });
}

const user1Credentials = userCredentials[0];
const user2Credentials = userCredentials[1];
const user3Credentials = userCredentials[2];

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

const signUp = async (page, username, password, confirmPassword) => {
  await page.getByTestId("sign-up-button").click();
  await typeCredentials(page, username, password, confirmPassword);
  await page.getByTestId("sign-up-submit-button").click();
};

const signIn = async (page, username, password) => {
  await typeCredentials(page, username, password);
  await page.getByTestId("sign-in-button").click();
};

const signOut = async (page) => {
  await page.getByTestId("logout-button").click();
  await page.getByTestId("confirm-button").click();
};

test.describe("Messaging app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:4000/", {
      data: {
        query: `
        mutation Mutation {
          resetDatabase
        }
        `,
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Page has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Messaging App/);
  });

  test("Try to create user with invalid username", async ({ page }) => {
    await signUp(
      page,
      "a",
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await expect(
      page.getByText("Username must be at least 4 characters long!")
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("Try to create user with invalid password", async ({ page }) => {
    await signUp(page, user1Credentials.username, "pass", "pass");
    await expect(
      page.getByText("Password must be at least 6 characters long!")
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("Try to create user with passwords not matching", async ({ page }) => {
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.password + "1"
    );
    await expect(page.getByText("Passwords do not match!")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Create a new user", async ({ page, request }) => {
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );
  });

  test("Try to create same user twice", async ({ page, request }) => {
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await signOut(page);
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await expect(page.getByText("Username already exists!")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Sign in success with a new user", async ({ page }) => {
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await signOut(page);
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await expect(page.getByText("Select Chat to Start Messaging.")).toBeVisible(
      { timeout: 10000 }
    );
  });

  test("Sign in fails with wrong credentials", async ({ page }) => {
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await signOut(page);
    await signIn(
      page,
      user1Credentials.username,
      user1Credentials.password + "1"
    );
    await expect(page.getByText("invalid username or password!")).toBeVisible({
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
        variables: user2Credentials,
      },
    });
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await page.getByTestId("contacts-button").click();
    await page.getByTestId("new-contact-button").click();
    await page.getByTestId(`contact-${user2Credentials.username}`).click();
    await page.getByTestId("add-new-contacts-button").click();
    await expect(
      page.getByText(user2Credentials.name, { exact: true })
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
        variables: user2Credentials,
      },
    });
    await signUp(
      page,
      user1Credentials.username,
      user1Credentials.password,
      user1Credentials.confirmPassword
    );
    await page.getByTestId("contacts-button").click();
    await page.getByTestId("new-contact-button").click();
    await page.getByTestId(`contact-${user2Credentials.username}`).click();
    await page.getByTestId("add-new-contacts-button").click();
    await page.getByTestId("chats-button").click();
    await page.getByTestId("new-chat-button").click();

    await page.getByTestId("new-private-chat-button").click();
    await page.getByTestId(`contact-${user2Credentials.username}`).click();
    await page.getByTestId("start-new-private-chat-button").click();

    await expect(page.getByText(`You, ${user2Credentials.name}`)).toBeVisible({
      timeout: 10000,
    });

    await page.getByTestId("new-message-input").fill("Hello!");
    await page.getByTestId("send-new-message-button").click();

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible({
      timeout: 10000,
    }); // Check if message shows in chat window

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible({
      timeout: 10000,
    }); // Check if message shows in chats list
  });
});
