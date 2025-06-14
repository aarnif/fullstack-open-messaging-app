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

const addContacts = async (credentials, contactDetails) =>
  await requestData(
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

const blockOrUnBlockContact = async (credentials, contactId) =>
  await requestData(
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

const createChat = async (
  credentials,
  memberIds,
  initialMessage,
  title = "",
  description = ""
) =>
  await requestData(
    {
      query: `mutation CreateChat(
        $title: String
        $description: String
        $memberIds: [ID!]!
        $initialMessage: MessageInput!
      ) {
        createChat(
          title: $title
          description: $description
          memberIds: $memberIds
          initialMessage: $initialMessage
        ) {
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
          messages {
            id
            type
            sender {
              id
              username
            }
            content
          }
        }
      }`,
      variables: {
        title,
        description,
        memberIds,
        initialMessage,
      },
    },
    credentials.token
  );

const changePassword = async (
  credentials,
  currentPassword,
  newPassword,
  confirmNewPassword
) =>
  await requestData(
    {
      query: `mutation ChangePassword($currentPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
          changePassword(currentPassword: $currentPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword) {
            id
          }
        }`,
      variables: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      },
    },
    credentials.token
  );

const checkIfUserHasBlockedYou = async (credentials, userId) =>
  await requestData(
    {
      query: `query CheckIfUserHasBlockedYou($userId: ID!) {
        checkIfUserHasBlockedYou(userId: $userId)
      }`,
      variables: {
        userId: userId,
      },
    },
    credentials.token
  );

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
  changePassword,
  checkIfUserHasBlockedYou,
};
