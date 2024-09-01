import { emptyDataBase, addUsers } from "../populateDataBase.js";
import start from "../index.js";
import helpers from "../utils/helpers.js";

import mongoose from "mongoose";
import assert from "node:assert";
import { title } from "node:process";
import e from "express";

const timeOut = 60000;
const credentials = {
  id: "",
  username: "test_user",
  password: "password",
  auth: "",
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
            contacts: [
              "6690caa54dc3eac2b83517d2",
              "6690caa54dc3eac2b83517d0",
              "6690caa54dc3eac2b83517d8",
            ],
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
          contactId: "6690caa54dc3eac2b83517d2",
        },
      },
      credentials.auth
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.removeContact).toBe("6690caa54dc3eac2b83517d2");
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
      "music_bob"
    );
    expect(response.body.data.allContactsByUser.contacts[1].username).toBe(
      "history_frank"
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
      "test_user"
    );
    expect(response.body.data.createChat.participants[1].username).toBe(
      "music_bob"
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

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createChat.title).toBe("Gamers");
    expect(response.body.data.createChat.description).toBe("Chat for gamers");
    expect(response.body.data.createChat.isGroupChat).toBe(true);
    expect(response.body.data.createChat.participants.length).toBe(3);
    expect(response.body.data.createChat.participants[0].username).toBe(
      "test_user"
    );
    expect(response.body.data.createChat.participants[1].username).toBe(
      "music_bob"
    );
    expect(response.body.data.createChat.participants[2].username).toBe(
      "history_frank"
    );
  });
});
