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
  signOut,
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

  test("starts private chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials);

    await expect(
      page.getByText(user2Credentials.name, { exact: true })
    ).toBeVisible();
    await sendMessage(page, "Hello!");

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible(); // Check if message shows in chat window

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible(); // Check if message shows in chats list
  });

  test("starts group chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

    await addContacts(page, [user2Credentials, user3Credentials]);

    await createGroupChat(page, "Test chat", "This is a test chat.", [
      user2Credentials,
      user3Credentials,
    ]);

    const chatTitle = await page.getByTestId("chat-header");

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText(/Test chat/);

    await page.getByTestId("new-message-input").fill("Hello everybody!");

    await page.getByTestId("send-new-message-button").click();

    await expect(
      page.getByText("Hello everybody!", { exact: true })
    ).toBeVisible(); // Check if message shows in chat window

    await expect(
      page.getByText("You: Hello everybody!", { exact: true })
    ).toBeVisible(); // Check if message shows in chats list
  });

  test("prevents creating chat without first message", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials);
    await expect(
      page.getByText(user2Credentials.name, { exact: true })
    ).toBeVisible();

    const chatItems = page.getByTestId(/chat-item-/);
    const initialCount = await chatItems.count();

    await page.getByTestId("new-message-input").fill("");
    await page.getByTestId("send-new-message-button").click();

    await page.waitForTimeout(500);

    const finalCount = await chatItems.count();
    expect(finalCount).toBe(initialCount);
  });

  test("prevents sending empty message in existing chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials);
    await expect(
      page.getByText(user2Credentials.name, { exact: true })
    ).toBeVisible();

    await sendMessage(page, "Hello!");

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible();
    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible();

    const messagesSelector = '[data-testid^="message-"]';
    const initialMsgCount = await page.locator(messagesSelector).count();

    await page.pause();

    await page.getByTestId("new-message-input").fill("");
    await page.getByTestId("send-new-message-button").click();
    await page.waitForTimeout(500);

    const finalMsgCount = await page.locator(messagesSelector).count();
    expect(finalMsgCount).toBe(initialMsgCount);

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible(); // Check if last message is still the same
  });

  test("edits group chat title and description", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

    await addContacts(page, [user2Credentials, user3Credentials]);

    await createGroupChat(page, "Test chat", "This is a test chat.", [
      user2Credentials,
      user3Credentials,
    ]);

    await page.getByTestId("new-message-input").fill("Hello everybody!");

    await page.getByTestId("send-new-message-button").click();

    await page.getByTestId("chat-info-button").click();
    await page.getByTestId("edit-group-chat-button").click();

    await page.pause();

    await page.getByTestId("edit-group-chat-title-input").fill("Updated title");
    await page
      .getByTestId("edit-group-chat-description-input")
      .fill("Updated description");

    await page.getByTestId("edit-group-chat-submit-button").click();
    await page.getByTestId("confirm-button").click();

    const chatTitle = await page.getByTestId("chat-title");

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText("Updated title");

    const chatDescription = await page.getByText("Updated description");
    await expect(chatDescription).toBeVisible();
    await page.getByTestId("close-group-chat-info-button").click();
  });

  test("adds new members to group chat", async ({ page }) => {
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

    const chatTitle = await page.getByTestId("chat-header");

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText(/Test chat/);

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

  test("removes members from group chat", async ({ page }) => {
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

    const chatTitle = await page.getByTestId("chat-header");

    await expect(chatTitle).toBeVisible();
    await expect(chatTitle).toHaveText(/Test chat/);

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
      `${user2Credentials.name} was removed`,
      { exact: true }
    );
  });

  test("orders chats by latest message", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createPrivateChat(page, user2Credentials);
    await expect(
      page.getByText(user2Credentials.name, { exact: true })
    ).toBeVisible();
    await sendMessage(page, "Hello!");

    const chatItems = page.getByTestId(/chat-item-/);

    let firstChatItem = await chatItems.first();
    await expect(firstChatItem).toBeVisible();
    await expect(firstChatItem.getByText("You: Hello!")).toBeVisible();

    await createPrivateChat(page, user3Credentials);
    await sendMessage(page, "Hi!");

    firstChatItem = await chatItems.first();
    await expect(firstChatItem).toBeVisible();
    await expect(firstChatItem.getByText("You: Hi!")).toBeVisible();
  });

  test("allows user to leave group chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createGroupChat(page, "Test Group", "A group to leave", [
      user2Credentials,
      user3Credentials,
    ]);

    await page.getByTestId("new-message-input").fill("Hello everybody!");
    await page.getByTestId("send-new-message-button").click();

    await signOut(page);
    await signIn(page, user2Credentials.username, user2Credentials.password);

    const chatItems = page.getByTestId(/chat-item-/);

    await chatItems.first().click();

    await page.getByTestId("chat-info-button").click();
    await page.getByTestId("leave-group-chat-button").click();
    await page.getByTestId("confirm-button").click();

    await expect(page.getByText("No chats found")).toBeVisible();
  });

  test("shows notifications for new messages", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials);
    await page.getByTestId("new-message-input").fill("Hello!");
    await page.getByTestId("send-new-message-button").click();

    await signOut(page);
    await signIn(page, user2Credentials.username, user2Credentials.password);

    const chatItems = page.getByTestId(/chat-item-/);

    const chatItem = await chatItems.first();
    await expect(chatItem).toBeVisible();

    const newMessagesCount = await chatItem.getByTestId("new-messages-count");
    await expect(newMessagesCount).toBeVisible();
    await expect(newMessagesCount).toHaveText("1");

    chatItem.click();
    await expect(newMessagesCount).not.toBeVisible();
  });

  test("allows deleting a group chat if user is admin", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createGroupChat(page, "Test Group", "A group to delete", [
      user2Credentials,
      user3Credentials,
    ]);

    await page.getByTestId("new-message-input").fill("Hello everybody!");
    await page.getByTestId("send-new-message-button").click();

    await page.getByTestId("chat-info-button").click();
    await page.getByTestId("delete-group-chat-button").click();
    await page.getByTestId("confirm-button").click();

    await expect(page.getByText("Chat deleted successfully.")).toBeVisible();
    await page.getByTestId("close-modal-button").click();
    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();
  });

  test("allows deleting a private chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials);
    await expect(
      page.getByText(user2Credentials.name, { exact: true })
    ).toBeVisible();

    await sendMessage(page, "Hello!");

    await page.getByTestId("delete-private-chat-button").click();
    await page.getByTestId("confirm-button").click();

    await expect(page.getByText("Chat deleted successfully.")).toBeVisible();
    await page.getByTestId("close-modal-button").click();
    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();
  });
});
