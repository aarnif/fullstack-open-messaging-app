import { emptyDataBase, addUsers } from "../populateDataBase.js";
import start from "../index.js";
import helpers from "../utils/helpers.js";

import mongoose from "mongoose";
import assert from "node:assert";

const timeOut = 60000;
const credentials = {
  id: "",
  username: "test_user",
  password: "password",
  auth: "",
};

const contactDetails = [
  {
    id: "6690caa54dc3eac2b83517d2",
    username: "streamer_charlie",
  },
  {
    id: "6690caa54dc3eac2b83517d0",
    username: "music_bob",
  },
  {
    id: "6690caa54dc3eac2b83517d8",
    username: "history_frank",
  },
];

const groupChatDetails = {
  id: "",
  title: "Gamers",
  description: "Chat for gamers",
};

describe("Server e2e tests users", () => {
  let server;

  beforeAll(async () => {
    await emptyDataBase();
    await addUsers();
    server = await start();
  }, timeOut);

  afterAll(async () => {
    await server?.stop();
    await mongoose.connection.close();
  }, timeOut);

  it("Create new user", async () => {
    const response = await helpers.requestData({
      query: `mutation CreateUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
            id
            username
        }
    }`,
      variables: credentials,
    });

    credentials.id = response.body.data.createUser.id;

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createUser.username).toBe(credentials.username);
  });

  it("Try to create same user twice", async () => {
    const response = await helpers.requestData({
      query: `mutation CreateUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
            id
            username
        }
    }`,
      variables: credentials,
    });

    expect(JSON.parse(response.text).errors).toBeDefined();
    expect(JSON.parse(response.text).errors[0].message).toBe(
      "Username already exists!"
    );
  });

  it("Login user", async () => {
    const response = await helpers.requestData({
      query: `mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }`,
      variables: credentials,
    });

    credentials.auth = `Bearer ${response.body.data.login.value}`;

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.login.value).toBeDefined();
  });

  it("User is logged in", async () => {
    const response = await helpers.requestData(
      {
        query: `query Me {
        me {
          id
          username
        }
    }`,
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.me.username).toBe(credentials.username);
  });

  it("Add three new contacts", async () => {
    let response;
    for (let i = 0; i < 2; ++i) {
      // Currently needs to be run twice to work, fix the resolver in question
      response = await helpers.requestData(
        {
          query: `mutation AddContacts($contacts: [ID!]) {
          addContacts(contacts: $contacts) {
            contacts {
              id
              username
            }
          }
      }`,
          variables: {
            contacts: contactDetails.map((contact) => contact.id),
          },
        },
        credentials.auth
      );
    }

    expect(JSON.parse(response.text).errors).toBeUndefined();
    assert.strictEqual(response.body.data.addContacts.contacts.length, 3);
    expect(response.body.data.addContacts.contacts[0].username).toBe(
      "streamer_charlie"
    );
    expect(response.body.data.addContacts.contacts[1].username).toBe(
      "music_bob"
    );
    expect(response.body.data.addContacts.contacts[2].username).toBe(
      "history_frank"
    );
  });

  it("Remove contact", async () => {
    let response;

    response = await helpers.requestData(
      {
        query: `mutation RemoveContact($contactId: ID!) {
          removeContact(contactId: $contactId)
        }`,
        variables: {
          contactId: contactDetails[0].id,
        },
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.removeContact).toBe(contactDetails[0].id);
  });

  it("User has two contacts", async () => {
    let response;

    response = await helpers.requestData(
      {
        query: `query AllContactsByUser {
          allContactsByUser {
            contacts {
              id
              username
            }
          }
        }`,
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    assert.strictEqual(response.body.data.allContactsByUser.contacts.length, 2);
    expect(response.body.data.allContactsByUser.contacts[0].username).toBe(
      contactDetails[1].username
    );
    expect(response.body.data.allContactsByUser.contacts[1].username).toBe(
      contactDetails[2].username
    );
  });

  it("Start chat with contact", async () => {
    let response;

    response = await helpers.requestData(
      {
        query: `mutation CreateChat($participants: [ID!]!) {
          createChat(participants: $participants) {
            id
            title
            isGroupChat
            participants {
              id
              username
            }
          }
        }`,
        variables: {
          participants: [credentials.id, "6690caa54dc3eac2b83517d0"],
        },
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createChat.title).toBe("Private chat");
    expect(response.body.data.createChat.isGroupChat).toBe(false);
    expect(response.body.data.createChat.participants.length).toBe(2);
    expect(response.body.data.createChat.participants[0].username).toBe(
      credentials.username
    );
    expect(response.body.data.createChat.participants[1].username).toBe(
      contactDetails[1].username
    );
  });

  it("Start group chat titled 'Gamers' ", async () => {
    let response;

    response = await helpers.requestData(
      {
        query: `mutation CreateChat($title: String, $description: String, $participants: [ID!]!) {
          createChat(title: $title, description: $description, participants: $participants) {
            id
            title
            description
            isGroupChat
            admin {
              id 
              username
            }
            participants {
              id
              username
            }
          }
        }`,
        variables: {
          title: "Gamers",

          description: "Chat for gamers",
          participants: [
            credentials.id,
            "6690caa54dc3eac2b83517d0",
            "6690caa54dc3eac2b83517d8",
          ],
        },
      },
      credentials.auth
    );

    groupChatDetails.id = response.body.data.createChat.id;

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createChat.title).toBe(groupChatDetails.title);
    expect(response.body.data.createChat.description).toBe(
      groupChatDetails.description
    );
    expect(response.body.data.createChat.isGroupChat).toBe(true);
    expect(response.body.data.createChat.participants.length).toBe(3);
    expect(response.body.data.createChat.admin.username).toBe(
      credentials.username
    );
    expect(response.body.data.createChat.participants[0].username).toBe(
      credentials.username
    );
    expect(response.body.data.createChat.participants[1].username).toBe(
      contactDetails[1].username
    );
    expect(response.body.data.createChat.participants[2].username).toBe(
      contactDetails[2].username
    );
  });

  it("Add message to chat titled 'Gamers' ", async () => {
    let response;

    response = await helpers.requestData(
      {
        query: `mutation AddMessageToChat($chatId: ID!, $type: String, $content: String) {
          addMessageToChat(chatId: $chatId, type: $type, content: $content) {
            id
            title
            messages {
              sender {
                id
                username
              }
              content
            }
          }
        }`,
        variables: {
          chatId: groupChatDetails.id,
          type: "message",
          content: "Hello gamers!",
        },
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.addMessageToChat.title).toBe(
      groupChatDetails.title
    );
    expect(response.body.data.addMessageToChat.messages.length).toBe(1);
    expect(
      response.body.data.addMessageToChat.messages[0].sender.username
    ).toBe(credentials.username);
    expect(response.body.data.addMessageToChat.messages[0].content).toBe(
      "Hello gamers!"
    );
  });

  it("Block contact", async () => {
    const blockContact = await helpers.requestData(
      {
        query: `mutation BlockOrUnBlockContact($contactId: ID!) {
          blockOrUnBlockContact(contactId: $contactId)
        }`,
        variables: {
          contactId: "6690caa54dc3eac2b83517d0",
        },
      },
      credentials.auth
    );

    const findUserById = await helpers.requestData(
      {
        query: `query FindUserById($id: ID!) {
          findUserById(id: $id) {
            blockedContacts
          }
        }`,
        variables: {
          id: credentials.id,
        },
      },
      credentials.auth
    );

    expect(JSON.parse(blockContact.text).errors).toBeUndefined();
    expect(blockContact.body.data.blockOrUnBlockContact).toBe(true);
    expect(JSON.parse(findUserById.text).errors).toBeUndefined();
    expect(findUserById.body.data.findUserById.blockedContacts.length).toBe(1);
    expect(findUserById.body.data.findUserById.blockedContacts[0]).toBe(
      "6690caa54dc3eac2b83517d0"
    );
  });
});
