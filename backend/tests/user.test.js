import assert from "node:assert";

import data from "./data.js";
import helpers from "./helpers.js";

const { credentials, contactDetails, groupChatDetails } = data;

const {
  timeOut,
  startServer,
  stopServer,
  resetDataBase,
  requestData,
  createUser,
  loginUser,
  createChat,
  addContacts,
  blockOrUnBlockContact,
  changePassword,
  checkIfUserHasBlockedYou,
} = helpers;

describe("User tests", () => {
  beforeAll(async () => {
    await startServer();
  }, timeOut);

  afterAll(async () => {
    await stopServer();
  }, timeOut);

  beforeEach(async () => {
    await resetDataBase();
  }, timeOut);

  it("creates new user", async () => {
    const response = await createUser(credentials);
    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createUser.username).toBe(credentials.username);
  });

  it("returns error when creating duplicate user", async () => {
    await createUser(credentials);
    const responseTwo = await createUser(credentials);
    expect(JSON.parse(responseTwo.text).errors).toBeDefined();
    expect(JSON.parse(responseTwo.text).errors[0].message).toBe(
      "Username already exists!"
    );
  });

  it("returns error when username is too short", async () => {
    const invalidCredentials = {
      username: "abc",
      password: "password",
      confirmPassword: "password",
    };

    const response = await createUser(invalidCredentials);

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "at least 4 characters"
    );
  });

  it("returns error when password is too short", async () => {
    const invalidCredentials = {
      username: "validuser",
      password: "short",
      confirmPassword: "short",
    };

    const response = await createUser(invalidCredentials);

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "at least 6 characters"
    );
  });

  it("returns error when passwords don't match", async () => {
    const invalidCredentials = {
      username: "validuser",
      password: "password",
      confirmPassword: "different",
    };

    const response = await createUser(invalidCredentials);

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "do not match"
    );
  });

  it("returns error when logging in with non-existent username", async () => {
    const nonExistentUser = {
      username: "doesnotexist",
      password: "password",
    };

    const response = await requestData({
      query: `mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          value
        }
      }`,
      variables: nonExistentUser,
    });

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "Invalid username or password!"
    );
  });

  it("returns error when logging in with wrong password", async () => {
    await createUser(credentials);

    const wrongCredentials = {
      ...credentials,
      password: "wrongpassword",
    };

    const response = await requestData({
      query: `mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          value
        }
      }`,
      variables: {
        username: wrongCredentials.username,
        password: wrongCredentials.password,
      },
    });

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "Invalid username or password!"
    );
  });

  it("logs in user successfully", async () => {
    await createUser(credentials);
    const response = await loginUser(credentials);
    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.login.value).toBeDefined();
  });

  it("verifies user is logged in", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const response = await requestData(
      {
        query: `query Me {
            me {
              id
              username
            }
          }`,
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.me.username).toBe(credentials.username);
  });

  it("gets all chats by user", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);
    await createChat(
      credentials,
      [credentials.id, contactDetails[0].id, contactDetails[1].id],
      groupChatDetails[0].startingMessage,
      groupChatDetails[0].title,
      groupChatDetails[0].description
    );

    const response = await requestData(
      {
        query: `query AllChatsByUser {
              allChatsByUser {
                chat {
                  id
                  title
                }
                unreadMessages
              }
            }`,
      },
      credentials.token
    );

    expect(response.errors).toBeUndefined();
    assert.strictEqual(response.body.data.allChatsByUser.length, 1);
    expect(response.body.data.allChatsByUser[0].chat.title).toBe(
      groupChatDetails[0].title
    );
    expect(response.body.data.allChatsByUser[0].unreadMessages).toBe(0);
  });

  it("gets all contacts by user", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    await addContacts(credentials, contactDetails.slice(0, 3));

    const response = await requestData(
      {
        query: `query AllContactsByUser($searchByName: String) {
            allContactsByUser(searchByName: $searchByName) {
              id
              username
              contacts {
                id
                username
                name
              }
            }
          }`,
        variables: { searchByName: "" },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();

    const contacts = response.body.data.allContactsByUser;
    expect(contacts.length).toBe(3);

    expect(contacts[0].username).toBe(contactDetails[0].username);
    expect(contacts[1].username).toBe(contactDetails[1].username);
    expect(contacts[2].username).toBe(contactDetails[2].username);
  });

  it("gets all contacts except by user", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    await addContacts(credentials, [contactDetails[0], contactDetails[1]]);

    const response = await requestData(
      {
        query: `query AllContactsExceptByUser($searchByName: String) {
            allContactsExceptByUser(searchByName: $searchByName) {
              id
              username
              name
            }
          }`,
        variables: { searchByName: "" },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();

    const contacts = response.body.data.allContactsExceptByUser;

    contacts.forEach((contact) => {
      expect([contactDetails[0].id, contactDetails[1].id]).not.toContain(
        contact.id
      );
    });
  });

  it("returns error when adding non-existent contact", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const response = await requestData(
      {
        query: `mutation AddContacts($userIds: [ID!]) {
          addContacts(userIds: $userIds) {
            id
            contacts {
              id
            }
          }
        }`,
        variables: { userIds: ["non-existent-id"] },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeDefined();
  });

  it("adds three new contacts", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const response = await addContacts(credentials, contactDetails.slice(0, 3));

    expect(JSON.parse(response.text).errors).toBeUndefined();
    assert.strictEqual(response.body.data.addContacts.contacts.length, 3);
    expect(response.body.data.addContacts.contacts[0].username).toBe(
      "techie_alice"
    );
    expect(response.body.data.addContacts.contacts[1].username).toBe(
      "music_bob"
    );
    expect(response.body.data.addContacts.contacts[2].username).toBe(
      "streamer_charlie"
    );
  });

  it("removes contact successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, contactDetails);

    const response = await requestData(
      {
        query: `mutation RemoveContact($contactId: ID!) {
          removeContact(contactId: $contactId)
        }`,
        variables: {
          contactId: contactDetails[0].id,
        },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.removeContact).toBe(contactDetails[0].id);
  });

  it("returns error when removing non-existent contact", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const nonExistentId = "507f1f77bcf86cd799439011";

    const response = await requestData(
      {
        query: `mutation RemoveContact($contactId: ID!) {
          removeContact(contactId: $contactId)
        }`,
        variables: { contactId: nonExistentId },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeDefined();
  });

  it("blocks contact successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, contactDetails);

    const blockContact = await blockOrUnBlockContact(
      credentials,
      contactDetails[0].id
    );

    const findUserById = await requestData(
      {
        query: `query FindUserById($id: ID!) {
          findUserById(id: $id) {
            blockedContacts {
              id
            }
          }
        }`,
        variables: {
          id: credentials.id,
        },
      },
      credentials.token
    );

    expect(JSON.parse(blockContact.text).errors).toBeUndefined();
    expect(blockContact.body.data.blockOrUnBlockContact).toBe(true);
    expect(JSON.parse(findUserById.text).errors).toBeUndefined();
    expect(findUserById.body.data.findUserById.blockedContacts.length).toBe(1);
    expect(findUserById.body.data.findUserById.blockedContacts[0].id).toBe(
      contactDetails[0].id
    );
  });

  it("unblocks contact successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, contactDetails);

    await blockOrUnBlockContact(credentials, contactDetails[0].id);
    const unBlockContact = await blockOrUnBlockContact(
      credentials,
      contactDetails[0].id
    );

    const findUserById = await requestData(
      {
        query: `query FindUserById($id: ID!) {
          findUserById(id: $id) {
            blockedContacts {
              id
            }
          }
        }`,
        variables: {
          id: credentials.id,
        },
      },
      credentials.token
    );

    expect(JSON.parse(unBlockContact.text).errors).toBeUndefined();
    expect(unBlockContact.body.data.blockOrUnBlockContact).toBe(false);
    expect(JSON.parse(findUserById.text).errors).toBeUndefined();
    expect(findUserById.body.data.findUserById.blockedContacts.length).toBe(0);
  });

  it("removes contact successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, contactDetails);
    let response;

    response = await requestData(
      {
        query: `mutation RemoveContact($contactId: ID!) {
          removeContact(contactId: $contactId)
        }`,
        variables: {
          contactId: contactDetails[1].id,
        },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.removeContact).toBe(contactDetails[1].id);
  });

  it("finds user by id", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const response = await requestData(
      {
        query: `query FindUserById($id: ID!) {
            findUserById(id: $id) {
              id
              username
              blockedContacts {
                id
              }
            }
          }`,
        variables: { id: credentials.id },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.findUserById.username).toBe(credentials.username);
  });

  it("returns null for current user when not logged in", async () => {
    const response = await requestData(
      {
        query: `query Me {
            me {
              id
              username
            }
          }`,
      },
      ""
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.me).toBe(null);
  });

  it("edits user profile successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const newName = "Updated Name";
    const newAbout = "Updated about text";
    const response = await requestData(
      {
        query: `mutation EditProfile($name: String, $about: String) {
            editProfile(name: $name, about: $about) {
              id
              username
              name
              about
            }
          }`,
        variables: { name: newName, about: newAbout },
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.editProfile.name).toBe(newName);
    expect(response.body.data.editProfile.about).toBe(newAbout);
  });

  it("returns error when unauthorized user tries to edit profile", async () => {
    const response = await requestData({
      query: `mutation EditProfile($name: String) {
          editProfile(name: $name) {
            id
          }
        }`,
      variables: { name: "New Name" },
    });

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "Not logged in"
    );
  });

  it("edits user settings successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const newSettings = {
      theme: "dark",
      time: "24h",
    };

    const response = await requestData(
      {
        query: `mutation EditSettings($theme: String!, $time: String!) {
          editSettings(theme: $theme, time: $time) {
            id
            settings {
              theme
              time
            }
          }
        }`,
        variables: newSettings,
      },
      credentials.token
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.editSettings.settings.theme).toBe("dark");
    expect(response.body.data.editSettings.settings.time).toBe("24h");
  });

  it("returns error when changing password with incorrect current password", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const response = await changePassword(
      credentials,
      "wrongpassword",
      "newpassword123",
      "newpassword123"
    );

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "Current password is incorrect!"
    );
  });

  it("returns error when changing password with too short new password", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const response = await changePassword(
      credentials,
      credentials.password,
      "short",
      "short"
    );
    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "New password must be at least 6 characters long!"
    );
  });

  it("returns error when changing password with non-matching new passwords", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const response = await changePassword(
      credentials,
      credentials.password,
      "newpassword123",
      "differentpassword123"
    );
    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "New passwords do not match!"
    );
  });

  it("changes password successfully", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    const changePasswordResponse = await changePassword(
      credentials,
      credentials.password,
      "newpassword123",
      "newpassword123"
    );

    expect(JSON.parse(changePasswordResponse.text).errors).toBeUndefined();
    expect(changePasswordResponse.body.data.changePassword.id).toBe(
      credentials.id
    );

    const loginResponse = await loginUser({
      username: credentials.username,
      password: "newpassword123",
    });
    expect(JSON.parse(loginResponse.text).errors).toBeUndefined();
    expect(loginResponse.body.data.login.value).toBeDefined();
  });

  it("checks if user has blocked you", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const secondUser = contactDetails[0];

    await loginUser(secondUser);
    await addContacts(secondUser, [credentials]);

    const blockResult = await blockOrUnBlockContact(secondUser, credentials.id);
    expect(JSON.parse(blockResult.text).errors).toBeUndefined();
    expect(blockResult.body.data.blockOrUnBlockContact).toBe(true);

    const checkResponse = await checkIfUserHasBlockedYou(
      credentials,
      secondUser.id
    );
    expect(JSON.parse(checkResponse.text).errors).toBeUndefined();
    expect(checkResponse.body.data.checkIfUserHasBlockedYou).toBe(true);

    const unblockResult = await blockOrUnBlockContact(
      secondUser,
      credentials.id
    );
    expect(JSON.parse(unblockResult.text).errors).toBeUndefined();
    expect(unblockResult.body.data.blockOrUnBlockContact).toBe(false);

    const checkAfterUnblock = await checkIfUserHasBlockedYou(
      credentials,
      secondUser.id
    );
    expect(JSON.parse(checkAfterUnblock.text).errors).toBeUndefined();
    expect(checkAfterUnblock.body.data.checkIfUserHasBlockedYou).toBe(false);
  });
});
