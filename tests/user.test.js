import { emptyDataBase } from "../populateDataBase.js";
import start from "../index.js";

import mongoose from "mongoose";

import helpers from "../utils/helpers.js";

const timeOut = 60000;
const credentials = {
  username: "test_user",
  password: "password",
};

describe("Server e2e tests users", () => {
  let server;

  beforeAll(async () => {
    await emptyDataBase();
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

    expect(response.errors).toBeUndefined();
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

    expect(response.errors).toBeUndefined();
    expect(response.body.data.login.value).toBeDefined();
  });
});
