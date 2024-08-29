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

const queryData = {
  query: `query AllChats {
  allChats {
    id
    title
  }
}`,
};

describe("Server e2e tests", () => {
  let server;

  beforeAll(async () => {
    await emptyDataBase();
    await addUsers();
    await addChats();
    await addChatsToUsers();
    server = await start();
  });

  afterAll(async () => {
    await server.stop();
    await mongoose.connection.close();
  });

  it("Get all dummy chats", async () => {
    const response = await request("http://localhost:4001")
      .post("/")
      .send(queryData);
    expect(response.errors).toBeUndefined();
    assert.strictEqual(response.body.data.allChats.length, 11);
  });
});
