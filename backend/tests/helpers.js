import request from "supertest";

import config from "../../config.js";
import { emptyDataBase, addUsers } from "../populateDataBase.js";
import server from "../server.js";
import pubsub from "../pubsub.js";
import db from "../db.js";

const timeOut = 60000;
let testServer;

const startServer = async () => {
  testServer = await server.start();
};

const stopServer = async () => {
  await testServer?.stop();
  await db.disconnect();
  pubsub.close();
};

const resetDataBase = async () => {
  await emptyDataBase();
  await addUsers();
};

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
          id
          username
          contacts {
            id
            username
            name
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

export default {
  timeOut,
  testServer,
  startServer,
  stopServer,
  resetDataBase,
  requestData,
  createUser,
  loginUser,
  addContacts,
  blockOrUnBlockContact,
  createChat,
};
