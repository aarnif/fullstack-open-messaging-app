import assert from "node:assert";
import request from "supertest";

import config from "../../config.js";
import { emptyDataBase, addUsers } from "../populateDataBase.js";
import server from "../server.js";
import pubsub from "../pubsub.js";
import db from "../db.js";

const timeOut = 60000;
const credentials = {
  id: "",
  username: "test_user",
  password: "password",
  confirmPassword: "password",
  token: "",
};

const contactDetails = [
  {
    id: "6690caa54dc3eac2b83517d2",
    username: "streamer_charlie",
    name: "Charlie Clark",
  },
  {
    id: "6690caa54dc3eac2b83517d0",
    username: "music_bob",
    name: "Bob Brown",
  },
  {
    id: "6690caa54dc3eac2b83517d8",
    username: "history_frank",
    name: "Frank Miller",
  },
  {
    id: "6690caa54dc3eac2b83517cc",
    username: "bookworm_jane",
    name: "Jane Smith",
  },
  {
    id: "6690caa54dc3eac2b83517ce",
    username: "techie_alice",
    name: "Alice Jones",
  },
];

const groupChatDetails = [
  {
    id: "",
    title: "Gamers",
    description: "Chat for gamers",
  },
  {
    id: "",
    title: "OffTopic",
    description: "Chat for off topic",
  },
];

const requestData = async (queryData, token = "") =>
  await request(`http://localhost:${config.PORT}`)
    .post("/")
    .set("Authorization", token)
    .send(queryData);

const createUser = async (credentials) => {
  const response = await requestData({
    query: `mutation CreateUser($username: String!, $password: String!, $confirmPassword: String!) {
      createUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
          id
          username
      }
  }`,
    variables: credentials,
  });
  credentials.id = response.body.data.createUser?.id;

  return response;
};

const loginUser = async (credentials) => {
  const response = await requestData({
    query: `mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
          value
      }
  }`,
    variables: credentials,
  });
  credentials.token = `Bearer ${response.body.data.login.value}`;

  return response;
};

const addContacts = async (credentials, contactDetails) => {
  const response = await requestData(
    {
      query: `mutation AddContacts($userIds: [ID!]) {
        addContacts(userIds: $userIds) {
          contacts {
            id
            username
          }
        }
    }`,
      variables: {
        userIds: contactDetails.map((contact) => contact.id),
      },
    },
    credentials.token
  );

  return response;
};

const blockOrUnBlockContact = async (credentials, contactId) => {
  const response = await requestData(
    {
      query: `mutation BlockOrUnBlockContact($contactId: ID!) {
        blockOrUnBlockContact(contactId: $contactId)
      }`,
      variables: {
        contactId: contactId,
      },
    },
    credentials.token
  );

  return response;
};

const createChat = async (
  credentials,
  memberIds,
  title = "",
  description = ""
) => {
  const response = await requestData(
    {
      query: `mutation CreateChat($title: String, $description: String, $memberIds: [ID!]!) {
      createChat(title: $title, description: $description, memberIds: $memberIds) {
        id
        title
        description
        isGroupChat
        admin {
          id
          username
        }
        members {
          id
          username
        }
      }
    }`,
      variables: {
        title: title,
        description: description,
        memberIds: memberIds,
      },
    },
    credentials.token
  );

  return response;
};

describe("Server tests", () => {
  let testServer;

  beforeAll(async () => {
    testServer = await server.start();
  }, timeOut);

  afterAll(async () => {
    await testServer?.stop();
    await db.disconnect();
    pubsub.close();
  }, timeOut);

  describe("User tests", () => {
    beforeEach(async () => {
      await emptyDataBase();
      await addUsers();
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

    it("Add three new contacts", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      const response = await addContacts(
        credentials,
        contactDetails.slice(0, 3)
      );

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

    it("Block contact", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, contactDetails);

      const blockContact = await blockOrUnBlockContact(
        credentials,
        "6690caa54dc3eac2b83517d0"
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
      expect(findUserById.body.data.findUserById.blockedContacts.length).toBe(
        1
      );
      expect(findUserById.body.data.findUserById.blockedContacts[0].id).toBe(
        "6690caa54dc3eac2b83517d0"
      );
    });

    it("Unblock contact", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, contactDetails);

      await blockOrUnBlockContact(credentials, "6690caa54dc3eac2b83517d0");
      const unBlockContact = await blockOrUnBlockContact(
        credentials,
        "6690caa54dc3eac2b83517d0"
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
      expect(findUserById.body.data.findUserById.blockedContacts.length).toBe(
        0
      );
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
  });

  describe("Chat tests", () => {
    beforeEach(async () => {
      await emptyDataBase();
      await addUsers();
    }, timeOut);

    it("Start chat with contact", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);

      const response = await createChat(credentials, [
        credentials.id,
        contactDetails[0].id,
      ]);

      expect(JSON.parse(response.text).errors).toBeUndefined();
      expect(response.body.data.createChat.title).toBe(contactDetails[0].name);
      expect(response.body.data.createChat.isGroupChat).toBe(false);
      expect(response.body.data.createChat.members.length).toBe(2);
      expect(response.body.data.createChat.members[0].username).toBe(
        credentials.username
      );
      expect(response.body.data.createChat.members[1].username).toBe(
        contactDetails[0].username
      );
    });

    it("Start group chat titled 'Gamers' ", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);

      const response = await createChat(
        credentials,
        [
          credentials.id,
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d8",
        ],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails.id = response.body.data.createChat.id;

      expect(JSON.parse(response.text).errors).toBeUndefined();
      expect(response.body.data.createChat.title).toBe(
        groupChatDetails[0].title
      );
      expect(response.body.data.createChat.description).toBe(
        groupChatDetails[0].description
      );
      expect(response.body.data.createChat.isGroupChat).toBe(true);
      expect(response.body.data.createChat.members.length).toBe(3);
      expect(response.body.data.createChat.admin.username).toBe(
        credentials.username
      );
      expect(response.body.data.createChat.members[0].username).toBe(
        credentials.username
      );
      expect(response.body.data.createChat.members[1].username).toBe(
        contactDetails[1].username
      );
      expect(response.body.data.createChat.members[2].username).toBe(
        contactDetails[2].username
      );
    });

    it("Add message to chat titled 'Gamers' ", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);

      const createdChat = await createChat(
        credentials,
        [
          credentials.id,
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d8",
        ],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails[0].id = createdChat.body.data.createChat.id;
      const response = await requestData(
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
            chatId: groupChatDetails[0].id,
            type: "message",
            content: "Hello gamers!",
          },
        },
        credentials.token
      );

      expect(JSON.parse(response.text).errors).toBeUndefined();
      expect(response.body.data.addMessageToChat.title).toBe(
        groupChatDetails[0].title
      );
      expect(response.body.data.addMessageToChat.messages.length).toBe(1);
      expect(
        response.body.data.addMessageToChat.messages[0].sender.username
      ).toBe(credentials.username);
      expect(response.body.data.addMessageToChat.messages[0].content).toBe(
        "Hello gamers!"
      );
    });

    it("Get all chats by user", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);
      await createChat(
        credentials,
        [
          credentials.id,
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d8",
        ],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      const response = await requestData(
        {
          query: `query AllChatsByUser {
            allChatsByUser {
              id
              title
            }
          }`,
        },
        credentials.token
      );

      expect(response.errors).toBeUndefined();
      assert.strictEqual(response.body.data.allChatsByUser.length, 1);
    });

    it("Find chat by id", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);

      const createdChat = await createChat(
        credentials,
        [
          credentials.id,
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d8",
        ],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails.id = createdChat.body.data.createChat.id;

      const response = await requestData({
        query: `query FindChatById($chatId: ID!) {
          findChatById(chatId: $chatId) {
            id
            title
          }
        }`,
        variables: { chatId: groupChatDetails.id },
      });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.findChatById.title).toBe("Gamers");
    });

    it("Find chat by members", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);
      const createdChat = await createChat(
        credentials,
        [
          credentials.id,
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d8",
        ],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails[0].id = createdChat.body.data.createChat.id;

      const response = await requestData({
        query: `query FindChatByMembers($members: [ID!]!) {
          findChatByMembers(members: $members) {
            id
            title
          }
        }`,
        variables: {
          members: [
            credentials.id,
            "6690caa54dc3eac2b83517d0",
            "6690caa54dc3eac2b83517d8",
          ],
        },
      });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.findChatByMembers.title).toBe(
        groupChatDetails[0].title
      );
    });

    it("Add members to chat", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);
      const createdChat = await createChat(
        credentials,
        [credentials.id, contactDetails[0].id, contactDetails[1].id],
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails[0].id = createdChat.body.data.createChat.id;

      const response = await requestData(
        {
          query: `mutation EditGroupChat($chatId: ID!
                  $title: String
                  $description: String
                  $input: ImageInput
                  $memberIds: [ID!]!) 
                  {
                  editGroupChat(chatId: $chatId
                  title: $title
                  description: $description
                  input: $input
                  memberIds: $memberIds) {
                    id
                    title
                    members {
                      id
                      username
                    }
                  }
          }`,
          variables: {
            chatId: groupChatDetails[0].id,
            memberIds: [credentials.id].concat(
              contactDetails.map((contact) => contact.id)
            ),
          },
        },
        credentials.token
      );

      expect(response.errors).toBeUndefined();
      expect(response.body.data.editGroupChat.title).toBe(
        groupChatDetails[0].title
      );
      expect(response.body.data.editGroupChat.members.length).toBe(6);
      expect(response.body.data.editGroupChat.members[0].username).toBe(
        credentials.username
      );
      for (let i = 1; i < 6; ++i) {
        expect(response.body.data.editGroupChat.members[i].username).toBe(
          contactDetails[i - 1].username
        );
      }
    });

    it("Remove members from chat", async () => {
      await createUser(credentials);
      await loginUser(credentials);
      await addContacts(credentials, [contactDetails[0]]);
      const createdChat = await createChat(
        credentials,
        contactDetails.map((contact) => contact.id),
        groupChatDetails[0].title,
        groupChatDetails[0].description
      );

      groupChatDetails[0].id = createdChat.body.data.createChat.id;

      const response = await requestData(
        {
          query: `mutation EditGroupChat($chatId: ID!
                  $title: String
                  $description: String
                  $input: ImageInput
                  $memberIds: [ID!]!) 
                  {
                  editGroupChat(chatId: $chatId
                  title: $title
                  description: $description
                  input: $input
                  memberIds: $memberIds) {
                    id
                    title
                    members {
                      id
                      username
                    }
                  }
          }`,
          variables: {
            chatId: groupChatDetails[0].id,
            memberIds: [
              credentials.id,
              contactDetails[0].id,
              contactDetails[1].id,
            ],
          },
        },
        credentials.token
      );

      expect(response.errors).toBeUndefined();
      expect(response.body.data.editGroupChat.title).toBe(
        groupChatDetails[0].title
      );
      expect(response.body.data.editGroupChat.members.length).toBe(3);
      expect(response.body.data.editGroupChat.members[0].username).toBe(
        credentials.username
      );
      for (let i = 1; i < 2; ++i) {
        expect(response.body.data.editGroupChat.members[i].username).toBe(
          contactDetails[i - 1].username
        );
      }
    });
  });
});
