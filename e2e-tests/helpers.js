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

const createPrivateChat = async (page, contact) => {
  await page.getByTestId("chats-button").click();
  await page.getByTestId("new-chat-button").click();
  await page.getByTestId("new-private-chat-button").click();
  await page.getByTestId(`contact-${contact.username}`).click();
  await page.getByTestId("start-new-private-chat").click();
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
};

export default {
  signUp,
  signIn,
  signOut,
  addContacts,
  createPrivateChat,
  createGroupChat,
  sendMessage,
  updateGroupChatMembers,
};
