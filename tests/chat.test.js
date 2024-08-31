import helpers from "../utils/helpers.js";

import {
  emptyDataBase,
  addUsers,
  addChats,
  addChatsToUsers,
} from "../populateDataBase.js";
import start from "../index.js";

import mongoose from "mongoose";

import assert from "node:assert";

const timeOut = 60000;

describe("Server e2e tests chats", () => {
  let server;

  beforeAll(async () => {
    await emptyDataBase();
    await addUsers();
    await addChats();
    await addChatsToUsers();
    server = await start();
  }, timeOut);

  afterAll(async () => {
    await server?.stop();
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

  it("Get one chat by participants", async () => {
    const chatByIdWithParticipants = await helpers.requestData({
      query: `query FindChatById($chatId: ID!) {
        findChatById(chatId: $chatId) {
          id
          title
          participants {
            id
          }
        }
      }`,
      variables: { chatId: "6690cc6331f8d4e66b57ae22" },
    });

    const chatByParticipants = await helpers.requestData({
      query: `query FindChatByParticipants($participants: [ID!]!) {
        findChatByParticipants(participants: $participants) {
          id
          title
        }
      }`,
      variables: {
        participants:
          chatByIdWithParticipants.body.data.findChatById.participants.map(
            (participant) => participant.id
          ),
      },
    });

    expect(chatByParticipants.errors).toBeUndefined();
    expect(chatByParticipants.body.data.findChatByParticipants.title).toBe(
      "Weekend Hikers"
    );
  });
});
