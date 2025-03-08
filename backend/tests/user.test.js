import assert from "node:assert";

import data from "./data.js";
import helpers from "./helpers.js";

const { credentials, contactDetails } = data;

const {
  timeOut,
  startServer,
  stopServer,
  resetDataBase,
  requestData,
  createUser,
  loginUser,
  addContacts,
  blockOrUnBlockContact,
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

  it("Create new user", async () => {
    const response = await createUser(credentials);
    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createUser.username).toBe(credentials.username);
  });

  it("Try to create same user twice", async () => {
    await createUser(credentials);
    const responseTwo = await createUser(credentials);
    expect(JSON.parse(responseTwo.text).errors).toBeDefined();
    expect(JSON.parse(responseTwo.text).errors[0].message).toBe(
      "Username already exists!"
    );
  });

  it("Returns error when username is too short", async () => {
    const invalidCredentials = {
      username: "abc", // Too short (less than 4 chars)
      password: "password",
      confirmPassword: "password",
    };

    const response = await createUser(invalidCredentials);

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "at least 4 characters"
    );
  });

  it("Returns error when password is too short", async () => {
    const invalidCredentials = {
      username: "validuser",
      password: "short", // Too short (less than 6 chars)
      confirmPassword: "short",
    };

    const response = await createUser(invalidCredentials);

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toContain(
      "at least 6 characters"
    );
  });

  it("Returns error when passwords don't match", async () => {
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

  it("Returns an error when trying to login with non-existent username", async () => {
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

  it("Returns an error when trying to login with wrong password", async () => {
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

  it("Login user", async () => {
    await createUser(credentials);
    const response = await loginUser(credentials);
    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.login.value).toBeDefined();
  });

  it("User is logged in", async () => {
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

  it("Should return valid contacts when querying users contacts", async () => {
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

    const user = response.body.data.allContactsByUser;
    console.log("user", user);
    expect(user.contacts.length).toBe(3);

    expect(user.contacts[0].username).toBe(contactDetails[0].username);
    expect(user.contacts[1].username).toBe(contactDetails[1].username);
    expect(user.contacts[2].username).toBe(contactDetails[2].username);
  });

  it("Should return contacts that are not in the user's contacts", async () => {
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

  it("Returns error when trying to add non-existent contact", async () => {
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

  it("Add three new contacts", async () => {
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

  it("Remove contact", async () => {
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

  it("Returns error when trying to remove a contact that doesn't exist", async () => {
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

  it("Block contact", async () => {
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

  it("Unblock contact", async () => {
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

  it("Remove contact", async () => {
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

  it("Find user by id", async () => {
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

  it("Returns null for 'me' when not logged in", async () => {
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

  it("Edit profile", async () => {
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

  it("Returns error when unauthorized user tries to edit profile", async () => {
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

  it("Edit user settings", async () => {
    await createUser(credentials);
    await loginUser(credentials);

    const newSettings = {
      theme: "dark",
      time: "24",
    };

    const response = await requestData(
      {
        query: `mutation EditSettings($theme: String, $time: String) {
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
    expect(response.body.data.editSettings.settings.time).toBe("24");
  });
});
