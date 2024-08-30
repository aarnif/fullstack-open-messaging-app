import config from "../config.js";
import {
  emptyDataBase,
  addUsers,
  addChats,
  addChatsToUsers,
} from "../populateDataBase.js";
import start from "../index.js";

import request from "supertest";
import mongoose from "mongoose";

import assert from "node:assert";

const timeOut = 20000;

const requestData = async (queryData) =>
  await request(`http://localhost:${config.PORT}`).post("/").send(queryData);

describe("Server e2e tests", () => {
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

  it("Get all dummy chats", async () => {
    const response = await requestData({
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
    const response = await requestData({
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
});
