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
  addContacts,
  createChat,
  editGroupChat,
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

  it("creates private chat with contact", async () => {
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

  it("creates group chat with multiple members", async () => {
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

  it("adds message to group chat", async () => {
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
          content: "This is a new message",
        },
      },
      credentials.token
    );

    const chatMessages = response.body.data.addMessageToChat.messages;

    expect(JSON.parse(response.text).errors).toBeUndefined();
    expect(response.body.data.addMessageToChat.title).toBe(
      groupChatDetails[0].title
    );
    expect(chatMessages.length).toBe(2);
    expect(chatMessages[chatMessages.length - 1].sender.username).toBe(
      credentials.username
    );
    expect(chatMessages[chatMessages.length - 1].content).toBe(
      "This is a new message"
    );
  });

  it("finds chat by id", async () => {
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

  it("finds chat by members", async () => {
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

  it("adds new members to group chat", async () => {
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

    const response = await editGroupChat(
      credentials,
      groupChatDetails[0].id,
      groupChatDetails[0].title,
      groupChatDetails[0].description,
      [credentials.id].concat(contactDetails.map((contact) => contact.id))
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

  it("removes members from group chat", async () => {
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

    const response = await editGroupChat(
      credentials,
      groupChatDetails[0].id,
      groupChatDetails[0].title,
      groupChatDetails[0].description,
      [credentials.id, contactDetails[0].id, contactDetails[1].id]
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
