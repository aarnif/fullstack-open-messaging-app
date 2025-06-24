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

const { signIn, signOut, addContacts, resetDatabase, createUsers } = helpers;

const createPrivateChat = async (page, contact, initialMessage) => {
  await page.getByTestId("chats-button").click();
  await page.getByTestId("new-chat-button").click();
  await page.getByTestId("new-private-chat-button").click();
  await page.getByTestId(`contact-${contact.username}`).click();
  await page.getByTestId("start-new-private-chat").click();
  await sendMessage(page, initialMessage);
};

const createGroupChat = async (
  page,
  title,
  description,
  contacts,
  initialMessage
) => {
  await page.getByTestId("chats-button").click();
  await page.getByTestId("new-chat-button").click();
  await page.getByTestId("new-group-chat-button").click();
  await page.getByTestId("group-chat-title-input").fill(title);
  await page.getByTestId("group-chat-description-input").fill(description);
  for (const contact of contacts) {
    await page.getByTestId(`contact-${contact.username}`).click();
  }
  await page.getByTestId("start-new-group-chat-button").click();
  await sendMessage(page, initialMessage);
};

const sendMessage = async (page, message) => {
  await page.getByTestId("new-message-input").fill(message);
  await page.getByTestId("send-new-message-button").click();
};

const updateGroupChatMembers = async (page, contacts) => {
  await page.getByTestId("edit-group-chat-button").click();
  await page.getByTestId("update-group-chat-members-button").click();
  for (const contact of contacts) {
    await page.getByTestId(`contact-${contact.username}`).click();
  }
  await page.getByTestId("submit-update-group-chat-members-button").click();
  await page.getByTestId("edit-group-chat-submit-button").click();
  await page.getByTestId("confirm-button").click();
};

const deleteChat = async (page, deleteButtonTestId) => {
  await page.getByTestId(deleteButtonTestId).click();
  await page.getByTestId("confirm-button").click();
  await expect(page.getByText("Chat deleted successfully.")).toBeVisible();
  await page.getByTestId("close-modal-button").click();
};

test.describe("Chats", () => {
  test.beforeEach(async ({ page, request }) => {
    await resetDatabase(request);
    await createUsers(page, userCredentials);
  });

  test("starts private chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials, "Hello!");

    await expect(page.getByTestId("chat-header")).toHaveText(
      user2Credentials.name
    );

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible(); // Check if message shows in chat window

    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible(); // Check if message shows in chats list
  });

  test("starts group chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();

    await addContacts(page, [user2Credentials, user3Credentials]);

    await createGroupChat(
      page,
      "Test chat",
      "This is a test chat.",
      [user2Credentials, user3Credentials],
      "Hello everybody!"
    );

    await expect(page.getByTestId("chat-header")).toHaveText(/Test chat/);

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
    await createPrivateChat(page, user2Credentials, "");
    await expect(page.getByTestId("chat-header")).toHaveText(
      user2Credentials.name
    );

    const chatItems = page.getByTestId(/chat-item-/);
    const initialCount = await chatItems.count();

    await page.waitForTimeout(500);

    const finalCount = await chatItems.count();
    expect(finalCount).toBe(initialCount);
  });

  test("prevents sending empty message in existing chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials, "Hello!");
    await expect(page.getByTestId("chat-header")).toHaveText(
      user2Credentials.name
    );

    await expect(page.getByText("Hello!", { exact: true })).toBeVisible();
    await expect(page.getByText("You: Hello!", { exact: true })).toBeVisible();

    const messagesSelector = '[data-testid^="message-"]';
    const initialMsgCount = await page.locator(messagesSelector).count();

    await sendMessage(page, "");
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

    await createGroupChat(
      page,
      "Test chat",
      "This is a test chat.",
      [user2Credentials, user3Credentials],
      "Hello everybody!"
    );

    await page.getByTestId("chat-info-button").click();
    await page.getByTestId("edit-group-chat-button").click();

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

    await createGroupChat(
      page,
      "Test chat",
      "This is a test chat.",
      [user2Credentials, user3Credentials],
      "Hello everybody!"
    );

    await expect(page.getByTestId("chat-header")).toHaveText(/Test chat/);

    await page.getByTestId("chat-info-button").click();

    await expect(page.getByText("3 members", { exact: true })).toBeVisible();

    await updateGroupChatMembers(page, [user4Credentials, user5Credentials]);

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

    await createGroupChat(
      page,
      "Test chat",
      "This is a test chat.",
      [user2Credentials, user3Credentials, user4Credentials, user5Credentials],
      "Hello everybody!"
    );

    await expect(page.getByTestId("chat-header")).toHaveText(/Test chat/);

    await page.getByTestId("chat-info-button").click();

    await expect(page.getByText("5 members", { exact: true })).toBeVisible();

    await updateGroupChatMembers(page, [user2Credentials]);

    await expect(page.getByText("4 members", { exact: true })).toBeVisible();
    await page.getByTestId("close-group-chat-info-button").click();

    await expect(page.getByTestId("latest-chat-message")).toHaveText(
      `${user2Credentials.name} was removed`,
      { exact: true }
    );
  });

  test("orders chats by latest message", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createPrivateChat(page, user2Credentials, "Hello!");
    await expect(page.getByTestId("chat-header")).toHaveText(
      user2Credentials.name
    );

    const chatItems = page.getByTestId(/chat-item-/);

    await expect(chatItems.first().getByText("You: Hello!")).toBeVisible();

    await createPrivateChat(page, user3Credentials, "Hi!");

    await expect(chatItems.first().getByText("You: Hi!")).toBeVisible();
  });

  test("allows user to leave group chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials, user3Credentials]);
    await createGroupChat(
      page,
      "Test Group",
      "A group to leave",
      [user2Credentials, user3Credentials],
      "Hello everybody!"
    );

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
    await createPrivateChat(page, user2Credentials, "Hello!");

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
    await createGroupChat(
      page,
      "Test Group",
      "A group to delete",
      [user2Credentials, user3Credentials],
      "Hello everybody!"
    );

    await page.getByTestId("chat-info-button").click();
    await deleteChat(page, "delete-group-chat-button");

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();
  });

  test("allows deleting a private chat", async ({ page }) => {
    await signIn(page, user1Credentials.username, user1Credentials.password);
    await addContacts(page, [user2Credentials]);
    await createPrivateChat(page, user2Credentials, "Hello!");

    await expect(page.getByTestId("chat-header")).toHaveText(
      user2Credentials.name
    );

    await deleteChat(page, "delete-private-chat-button");

    await expect(
      page.getByText("Select Chat to Start Messaging.")
    ).toBeVisible();
  });
});
