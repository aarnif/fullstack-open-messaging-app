// @ts-check
import { test, expect } from "@playwright/test";

const userCredentials = [];

for (let i = 1; i <= 5; i++) {
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
const user4Credentials = userCredentials[3];
const user5Credentials = userCredentials[4];

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

const addContacts = async (page, contacts) => {
  await page.getByTestId("contacts-button").click();
  await page.getByTestId("new-contact-button").click();
  for (const contact of contacts) {
    await page.getByTestId(`contact-${contact.username}`).click();
  }
  await page.getByTestId("add-new-contacts-button").click();
};

const createGroupChat = async (page, title, description, contacts) => {
  await page.getByTestId("chats-button").click();
  await page.getByTestId("new-chat-button").click();
  await page.getByTestId("new-group-chat-button").click();
  await page.getByTestId("group-chat-title-input").fill(title);
  await page.getByTestId("group-chat-description-input").fill(description);
  for (const contact of contacts) {
    await page.getByTestId(`contact-${contact.username}`).click();
  }
  await page.getByTestId("start-new-group-chat-button").click();
};

const updateGroupChatMembers = async (page, contacts) => {
  await page.getByTestId("edit-group-chat-button").click();
  await page.getByTestId("update-group-chat-members-button").click();
  for (const contact of contacts) {
    await page.getByTestId(`contact-${contact.username}`).click();
  }
  await page.getByTestId("submit-update-group-chat-members-button").click();
};

test.describe("Messaging app", () => {
  test.describe("Users", () => {
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
        timeout: 20000,
      });
    });

    test("Try to create user with invalid password", async ({
      page,
      request,
    }) => {
      await signUp(page, user1Credentials.username, "pass", "pass");
      await expect(
        page.getByText("Password must be at least 6 characters long!")
      ).toBeVisible({
        timeout: 20000,
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
        timeout: 20000,
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
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible({ timeout: 20000 });
    });

    test("Try to create same user twice", async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
          mutation Mutation {
            resetDatabase
          }
          `,
        },
      });
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
        timeout: 20000,
      });
    });

    test("Sign in success with a new user", async ({ page, request }) => {
      await request.post("http://localhost:4000/", {
        data: {
          query: `
          mutation Mutation {
            resetDatabase
          }
          `,
        },
      });
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await signOut(page);
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible({ timeout: 20000 });
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
      await expect(page.getByText("invalid username or password!")).toBeVisible(
        {
          timeout: 20000,
        }
      );
    });

    test("Edit user profile", async ({ page }) => {
      await signUp(
        page,
        user1Credentials.username,
        user1Credentials.password,
        user1Credentials.confirmPassword
      );
      await page.getByTestId("profile-button").click();
      await page.getByTestId("edit-profile-button").click();
      await page.getByTestId("profile-name-input").fill("John Doe");
      await page.getByTestId("profile-about-input").fill("I am John Doe.");
      await page.getByTestId("submit-edit-profile-button").click();
      await page.getByTestId("confirm-button").click();

      await expect(page.getByText("John Doe", { exact: true })).toBeVisible({
        timeout: 20000,
      });
      await expect(page.getByText("I am John Doe.")).toBeVisible({
        timeout: 20000,
      });
    });
  });

  test.describe("Contacts", () => {
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
      userCredentials.forEach(
        async (credential) =>
          await request.post("http://localhost:4000/", {
            data: {
              query: `
          mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
            createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
              username
            }
          }
          `,
              variables: credential,
            },
          })
      );
      await page.goto("http://localhost:5173");
    });

    test("Add new contacts", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await expect(
        page.getByText(user2Credentials.name, { exact: true })
      ).toBeVisible({
        timeout: 20000,
      });
    });

    test("Block and unblock contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await page.getByTestId("contacts-button").click();
      await page.getByTestId(user2Credentials.username).click();
      await page.getByTestId("block-or-unblock-contact-button").click();
      await page.getByTestId("confirm-button").click();
      await expect(
        page.getByText("You have blocked this contact!")
      ).toBeVisible({
        timeout: 20000,
      });

      await page.getByTestId("block-or-unblock-contact-button").click();
      await page.getByTestId("confirm-button").click();

      await expect(
        page.getByText("You have blocked this contact!")
      ).not.toBeVisible({
        timeout: 20000,
      });
    });

    test("Remove contact", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);
      await addContacts(page, [user2Credentials]);
      await page.getByTestId("contacts-button").click();
      await page.getByTestId(user2Credentials.username).click();
      await page.getByTestId("remove-contact-button").click();
      await page.getByTestId("confirm-button").click();
      await expect(page.getByText("No contacts found")).not.toBeVisible({
        timeout: 20000,
      });
    });
  });

  test.describe("Chats", () => {
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
      userCredentials.forEach(
        async (credential) =>
          await request.post("http://localhost:4000/", {
            data: {
              query: `
          mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
            createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
              username
            }
          }
          `,
              variables: credential,
            },
          })
      );
      await page.goto("http://localhost:5173");
    });

    test("Start a private chat", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);

      await addContacts(page, [user2Credentials]);

      await page.getByTestId("chats-button").click();
      await page.getByTestId("new-chat-button").click();

      await page.getByTestId("new-private-chat-button").click();
      await page.getByTestId(`contact-${user2Credentials.username}`).click();
      await page.getByTestId("start-new-private-chat-button").click();

      await expect(page.getByText(`You, ${user2Credentials.name}`)).toBeVisible(
        {
          timeout: 20000,
        }
      );

      await page.getByTestId("new-message-input").fill("Hello!");
      await page.getByTestId("send-new-message-button").click();

      await expect(page.getByText("Hello!", { exact: true })).toBeVisible({
        timeout: 20000,
      }); // Check if message shows in chat window

      await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible({
        timeout: 20000,
      }); // Check if message shows in chats list
    });

    test("Start a group chat", async ({ page }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);

      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible({ timeout: 20000 });

      await addContacts(page, [user2Credentials, user3Credentials]);

      await createGroupChat(page, "Test chat", "This is a test chat.", [
        user2Credentials,
        user3Credentials,
      ]);

      const chatTitle = await page.getByTestId("new-chat-title");

      await expect(chatTitle).toBeVisible({ timeout: 20000 });
      await expect(chatTitle).toHaveText("Test chat");

      await page.getByTestId("new-message-input").fill("Hello everybody!");

      await page.getByTestId("send-new-message-button").click();

      await expect(
        page.getByText("Hello everybody!", { exact: true })
      ).toBeVisible({
        timeout: 20000,
      }); // Check if message shows in chat window

      await expect(
        page.getByText("You: Hello everybody!", { exact: true })
      ).toBeVisible({
        timeout: 20000,
      }); // Check if message shows in chats list
    });

    test("Add new members to group chat", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);

      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible({ timeout: 20000 });

      await addContacts(page, [
        user2Credentials,
        user3Credentials,
        user4Credentials,
        user5Credentials,
      ]);

      await createGroupChat(page, "Test chat", "This is a test chat.", [
        user2Credentials,
        user3Credentials,
      ]);

      const chatTitle = await page.getByTestId("new-chat-title");

      await expect(chatTitle).toBeVisible({ timeout: 20000 });
      await expect(chatTitle).toHaveText("Test chat");

      await page.getByTestId("new-message-input").fill("Hello everybody!");

      await page.getByTestId("send-new-message-button").click();
      await page.getByTestId("chat-info-button").click();

      await expect(page.getByText("3 members", { exact: true })).toBeVisible({
        timeout: 20000,
      });

      await page.getByTestId("edit-group-chat-button").click();
      await updateGroupChatMembers(page, [user4Credentials, user5Credentials]);
      await expect(page.getByText("5 members", { exact: true })).toBeVisible({
        timeout: 20000,
      });
    });

    test("Remove members from group chat", async ({ page, request }) => {
      await signIn(page, user1Credentials.username, user1Credentials.password);

      await expect(
        page.getByText("Select Chat to Start Messaging.")
      ).toBeVisible({ timeout: 20000 });

      await addContacts(page, [
        user2Credentials,
        user3Credentials,
        user4Credentials,
        user5Credentials,
      ]);

      await createGroupChat(page, "Test chat", "This is a test chat.", [
        user2Credentials,
        user3Credentials,
        user4Credentials,
        user5Credentials,
      ]);

      const chatTitle = await page.getByTestId("new-chat-title");

      await expect(chatTitle).toBeVisible({ timeout: 20000 });
      await expect(chatTitle).toHaveText("Test chat");

      await page.getByTestId("new-message-input").fill("Hello everybody!");

      await page.getByTestId("send-new-message-button").click();
      await page.getByTestId("chat-info-button").click();

      await expect(page.getByText("5 members", { exact: true })).toBeVisible({
        timeout: 20000,
      });

      await page.getByTestId("edit-group-chat-button").click();
      await updateGroupChatMembers(page, [user2Credentials, user3Credentials]);
      await expect(page.getByText("3 members", { exact: true })).toBeVisible({
        timeout: 20000,
      });
    });
  });
});
