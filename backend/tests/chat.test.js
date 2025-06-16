import assert from "node:assert";

import data from "./data.js";
import helpers from "./helpers.js";
import User from "../models/user.js";

const { credentials, contactDetails, groupChatDetails } = data;

const {
  timeOut,
  startServer,
  stopServer,
  resetDataBase,
  requestData,
  createUser,
  loginUser,
  addContacts,
  createChat,
  addMessageToChat,
  markChatAsRead,
} = helpers;

describe("Chat tests", () => {
  beforeAll(async () => {
    await startServer();
  }, timeOut);

  afterAll(async () => {
    await stopServer();
  }, timeOut);

  beforeEach(async () => {
    await resetDataBase();
  }, timeOut);

  it("Start chat with contact", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    const response = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id],
      groupChatDetails[0].startingMessage
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createChat.title).toBe(contactDetails[0].name);
    expect(response.body.data.createChat.isGroupChat).toBe(false);
    expect(response.body.data.createChat.members.length).toBe(2);
    expect(response.body.data.createChat.messages.length).toBe(1);
    expect(response.body.data.createChat.messages[0].content).toBe(
      groupChatDetails[0].startingMessage.content
    );
  });

  it("Start group chat titled 'Gamers'", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    const response = await createChat(
      credentials,
      [
        credentials.id,
        ...contactDetails.slice(0, 2).map((contact) => contact.id),
      ],
      groupChatDetails[0].startingMessage,
      groupChatDetails[0].title,
      groupChatDetails[0].description
    );

    groupChatDetails.id = response.body.data.createChat.id;

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.createChat.title).toBe(groupChatDetails[0].title);
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
      contactDetails[0].username
    );
    expect(response.body.data.createChat.members[2].username).toBe(
      contactDetails[1].username
    );
    expect(response.body.data.createChat.messages.length).toBe(1);
    expect(response.body.data.createChat.messages[0].content).toBe(
      groupChatDetails[0].startingMessage.content
    );
  });

  it("Add message to chat titled 'Gamers'", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    const createdChat = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id, contactDetails[1].id],
      groupChatDetails[0].startingMessage,
      groupChatDetails[0].title,
      groupChatDetails[0].description
    );

    groupChatDetails[0].id = createdChat.body.data.createChat.id;

    const response = await addMessageToChat(
      credentials,
      groupChatDetails[0].id,
      "This is a new message"
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.addMessageToChat.title).toBe(
      groupChatDetails[0].title
    );
    expect(response.body.data.addMessageToChat.messages.length).toBe(2);
    expect(
      response.body.data.addMessageToChat.messages[0].sender.username
    ).toBe(credentials.username);
    expect(response.body.data.addMessageToChat.messages[0].content).toBe(
      "This is a new message"
    );
  });

  it("Get all chats by user", async () => {
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
      [credentials.id, contactDetails[0].id, contactDetails[1].id],
      groupChatDetails[0].startingMessage,
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
      [credentials.id, contactDetails[0].id, contactDetails[1].id],
      groupChatDetails[0].startingMessage,
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
        members: [credentials.id, contactDetails[0].id, contactDetails[1].id],
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
      groupChatDetails[0].startingMessage,
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
          title: groupChatDetails[0].title,
          description: groupChatDetails[0].description,
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
      groupChatDetails[0].startingMessage,
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
          title: groupChatDetails[0].title,
          description: groupChatDetails[0].description,
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

  it("Should add unread message when creating a chat", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    await loginUser(contactDetails[0]);

    const response = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id],
      { type: "message", content: "Hello!" }
    );

    expect(JSON.parse(response.text).errors).toBeUndefined();

    const user2 = await User.findById(contactDetails[0].id);
    expect(user2.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages[0].chatId.toString()).toBe(
      response.body.data.createChat.id
    );
    expect(user2.unreadMessages[0].messages[0].messageId).toBeDefined();

    const user1 = await User.findById(credentials.id);
    expect(user1.unreadMessages.length).toBe(0);
  });

  it("Should add unread message when adding message to chat", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    await loginUser(contactDetails[0]);

    const chatResponse = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id],
      { type: "message", content: "Hello!" }
    );

    const chatId = chatResponse.body.data.createChat.id;

    const messageResponse = await addMessageToChat(
      credentials,
      chatId,
      "How are you?"
    );

    expect(JSON.parse(messageResponse.text).errors).toBeUndefined();

    const user2 = await User.findById(contactDetails[0].id);
    expect(user2.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages[0].chatId.toString()).toBe(chatId);
    expect(user2.unreadMessages[0].messages.length).toBe(2);
  });

  it("Should mark chat as read and remove unread messages", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0]]);

    await loginUser(contactDetails[0]);

    const chatResponse = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id],
      { type: "message", content: "Hello!" }
    );

    const chatId = chatResponse.body.data.createChat.id;

    await addMessageToChat(credentials, chatId, "Second message");

    let user2 = await User.findById(contactDetails[0].id);
    expect(user2.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages[0].messages.length).toBe(2);

    const markReadResponse = await markChatAsRead(contactDetails[0], chatId);
    expect(JSON.parse(markReadResponse.text).errors).toBeUndefined();

    user2 = await User.findById(contactDetails[0].id);
    expect(user2.unreadMessages.length).toBe(0);
  });

  it("Should handle multiple chats unread messages independently", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0], contactDetails[1]]);

    await loginUser(contactDetails[0]);
    await loginUser(contactDetails[1]);

    const chat1Response = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id],
      { type: "message", content: "Chat 1 message" }
    );

    const chat2Response = await createChat(
      credentials,
      [credentials.id, contactDetails[1].id],
      { type: "message", content: "Chat 2 message" }
    );

    const chat1Id = chat1Response.body.data.createChat.id;
    const chat2Id = chat2Response.body.data.createChat.id;

    let user1 = await User.findById(contactDetails[0].id);
    let user2 = await User.findById(contactDetails[1].id);
    expect(user1.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages.length).toBe(1);

    await markChatAsRead(contactDetails[0], chat1Id);

    user1 = await User.findById(contactDetails[0].id);
    user2 = await User.findById(contactDetails[1].id);
    expect(user1.unreadMessages.length).toBe(0);
    expect(user2.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages[0].chatId.toString()).toBe(chat2Id);
  });

  it("Should handle group chat unread messages correctly", async () => {
    await createUser(credentials);
    await loginUser(credentials);
    await addContacts(credentials, [contactDetails[0], contactDetails[1]]);

    await loginUser(contactDetails[0]);
    await loginUser(contactDetails[1]);

    const groupChatResponse = await createChat(
      credentials,
      [credentials.id, contactDetails[0].id, contactDetails[1].id],
      groupChatDetails[0].startingMessage,
      groupChatDetails[0].title,
      groupChatDetails[0].description
    );

    const chatId = groupChatResponse.body.data.createChat.id;

    const user1 = await User.findById(contactDetails[0].id);
    const user2 = await User.findById(contactDetails[1].id);
    const sender = await User.findById(credentials.id);

    expect(user1.unreadMessages.length).toBe(1);
    expect(user2.unreadMessages.length).toBe(1);
    expect(sender.unreadMessages.length).toBe(0);

    expect(user1.unreadMessages[0].chatId.toString()).toBe(chatId);
    expect(user2.unreadMessages[0].chatId.toString()).toBe(chatId);
  });
});
