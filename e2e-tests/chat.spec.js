// @ts-check
import { test, expect } from "@playwright/test";

import data from "./data.js";
import helpers from "./helpers.js";

const {
  userCredentials,
  user1Credentials,
  user2Credentials,
  user3Credentials,
  user4Credentials,
  user5Credentials,
} = data;

const {
  signIn,
  addContacts,
  createPrivateChat,
  createGroupChat,
  sendMessage,
  updateGroupChatMembers,
} = helpers;

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
    await createPrivateChat(page, user2Credentials);

    await expect(page.getByText(`You, ${user2Credentials.name}`)).toBeVisible();
    await sendMessage(page, "Hello!");

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible(); // Check if message shows in chat window

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible(); // Check if message shows in chats list
  });

  test("Start a group chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

    await addContacts(page, [user2Credentials, user3Credentials]);

    await createGroupChat(page, "Test chat", "This is a test chat.", [
      user2Credentials,
      user3Credentials,
    ]);

    const chatTitle = await page.getByTestId("new-chat-title");

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText("Test chat");

    await page.getByTestId("new-message-input").fill("Hello everybody!");

    await page.getByTestId("send-new-message-button").click();

    await expect(
      page.getByText("Hello everybody!", { exact: true })
    ).toBeVisible(); // Check if message shows in chat window

    await expect(
      page.getByText("You: Hello everybody!", { exact: true })
    ).toBeVisible(); // Check if message shows in chats list
  });

  test("Add new members to group chat", async ({ page, request }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

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

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText("Test chat");

    await page.getByTestId("new-message-input").fill("Hello everybody!");

    await page.getByTestId("send-new-message-button").click();
    await page.getByTestId("chat-info-button").click();

    await expect(page.getByText("3 members", { exact: true })).toBeVisible();

    await updateGroupChatMembers(page, [user4Credentials, user5Credentials]);
    await page.getByTestId("edit-group-chat-submit-button").click();
    await page.getByTestId("confirm-button").click();
    await expect(page.getByText("5 members", { exact: true })).toBeVisible();
    await page.getByTestId("close-group-chat-info-button").click();
  });

  test("Remove members from group chat", async ({ page, request }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

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

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText("Test chat");

    await page.getByTestId("new-message-input").fill("Hello everybody!");

    await page.getByTestId("send-new-message-button").click();
    await page.getByTestId("chat-info-button").click();

    await expect(page.getByText("5 members", { exact: true })).toBeVisible();

    await updateGroupChatMembers(page, [user2Credentials]);
    await page.getByTestId("edit-group-chat-submit-button").click();
    await page.getByTestId("confirm-button").click();
    await expect(page.getByText("4 members", { exact: true })).toBeVisible();
    await page.getByTestId("close-group-chat-info-button").click();

    const latestMessage = await page.getByTestId("latest-chat-message");

    await expect(latestMessage).toBeVisible();
    await expect(latestMessage).toHaveText(
      `${user2Credentials.name} was removed`
    );
  });

  test("Chats are appearing on ascending order based on latest message", async ({
    page,
    request,
  }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createPrivateChat(page, user2Credentials);
    await expect(page.getByText(`You, ${user2Credentials.name}`)).toBeVisible();
    await sendMessage(page, "Hello!");

    let firstChatItem = await page.getByTestId("chat-item-0");
    await expect(firstChatItem).toBeVisible();
    await expect(firstChatItem.getByText("You: Hello!")).toBeVisible();

    await createPrivateChat(page, user3Credentials);
    await sendMessage(page, "Hi!");

    firstChatItem = await page.getByTestId("chat-item-0");
    await expect(firstChatItem).toBeVisible();
    await expect(firstChatItem.getByText("You: Hi!")).toBeVisible();
  });
});
