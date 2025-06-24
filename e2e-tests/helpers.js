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

const resetDatabase = async (request) => {
  await request.post("http://localhost:4000/", {
    data: {
      query: `
        mutation Mutation {
          resetDatabase
        }
      `,
    },
  });
};

const createUsers = async (page, userCredentials) => {
  for (const credential of userCredentials) {
    await page.goto("http://localhost:5173");
    await signUp(
      page,
      credential.username,
      credential.password,
      credential.confirmPassword
    );
    await signOut(page);
  }
};

export default {
  signUp,
  signIn,
  signOut,
  addContacts,
  resetDatabase,
  createUsers,
};
