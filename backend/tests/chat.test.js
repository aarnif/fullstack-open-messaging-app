import helpers from "../utils/helpers.js";

import {
  emptyDataBase,
  addUsers,
  addChats,
  addChatsToUsers,
} from "../populateDataBase.js";
import server from "../server.js";

import mongoose from "mongoose";

import assert from "node:assert";

const timeOut = 60000;

describe("Server e2e tests chats", () => {
  let testServer;

  beforeAll(async () => {
    await emptyDataBase();
    await addUsers();
    await addChats();
    await addChatsToUsers();
    testServer = await server.start();
  }, timeOut);

  afterAll(async () => {
    await testServer?.stop();
    await mongoose.connection.close();
  }, timeOut);

  it("Count all dummy chats", async () => {
    const response = await helpers.requestData({
      query: `query CountChats {
       countChats
      }`,
    });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.countChats).toBe(11);
  });

  it("Get all dummy chats", async () => {
    const response = await helpers.requestData({
      query: `query AllChats {
          allChats {
            id
            title
          }
        }`,
    });

    expect(response.errors).toBeUndefined();
    assert.strictEqual(response.body.data.allChats.length, 11);
  });

  it("Get one chat by id", async () => {
    const response = await helpers.requestData({
      query: `query FindChatById($chatId: ID!) {
        findChatById(chatId: $chatId) {
          id
          title
        }
      }`,
      variables: { chatId: "6690cc6331f8d4e66b57ae22" },
    });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.findChatById.title).toBe("Weekend Hikers");
  });

  it("Get one chat by members", async () => {
    const chatByIdWithMembers = await helpers.requestData({
      query: `query FindChatById($chatId: ID!) {
        findChatById(chatId: $chatId) {
          id
          title
          members {
            id
          }
        }
      }`,
      variables: { chatId: "6690cc6331f8d4e66b57ae22" },
    });

    const chatByMembers = await helpers.requestData({
      query: `query FindChatByMembers($members: [ID!]!) {
        findChatByMembers(members: $members) {
          id
          title
        }
      }`,
      variables: {
        members: chatByIdWithMembers.body.data.findChatById.members.map(
          (member) => member.id
        ),
      },
    });

    expect(chatByMembers.errors).toBeUndefined();
    expect(chatByMembers.body.data.findChatByMembers.title).toBe(
      "Weekend Hikers"
    );
  });
});
