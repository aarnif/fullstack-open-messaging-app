import { gql } from "@apollo/client";
import { USER_DETAILS, CHAT_DETAILS } from "./queries";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    createUser(
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat(
    $title: String
    $description: String
    $memberIds: [ID!]!
  ) {
    createChat(
      title: $title
      description: $description
      memberIds: $memberIds
    ) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const ADD_MESSAGE_TO_CHAT = gql`
  mutation AddMessageToChat(
    $chatId: ID!
    $type: String
    $content: String!
    $input: ImageInput
  ) {
    addMessageToChat(
      chatId: $chatId
      type: $type
      content: $content
      input: $input
    ) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: ID!) {
    deleteChat(chatId: $chatId)
  }
`;

export const MARK_MESSAGES_IN_CHAT_READ = gql`
  mutation MarkAllMessagesInChatRead($chatId: ID!) {
    markAllMessagesInChatRead(chatId: $chatId) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const UPDATE_CHAT_MEMBERS = gql`
  mutation UpdateGroupChatMembers($chatId: ID!, $members: [ID!]!) {
    updateGroupChatMembers(chatId: $chatId, members: $members) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const LEAVE_GROUP_CHATS = gql`
  mutation LeaveGroupChats($chatIds: [ID!]!) {
    leaveGroupChats(chatIds: $chatIds)
  }
`;

export const ADD_CONTACTS = gql`
  mutation AddContacts($contacts: [ID!]!) {
    addContacts(contacts: $contacts) {
      id
      username
      name
      contacts {
        ...UserDetails
      }
    }
  }

  ${USER_DETAILS}
`;

export const REMOVE_CONTACT = gql`
  mutation RemoveContact($contactId: ID!) {
    removeContact(contactId: $contactId)
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile($name: String, $about: String, $input: ImageInput) {
    editProfile(name: $name, about: $about, input: $input) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const EDIT_SETTINGS = gql`
  mutation EditSettings($theme: String, $time: String) {
    editSettings(theme: $theme, time: $time) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const EDIT_CHAT = gql`
  mutation UpdateGroupChat(
    $chatId: ID!
    $title: String
    $description: String
    $input: ImageInput
  ) {
    updateGroupChat(
      chatId: $chatId
      title: $title
      description: $description
      input: $input
    ) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const BLOCK_OR_UNBLOCK_CONTACT = gql`
  mutation BlockOrUnBlockContact($contactId: ID!) {
    blockOrUnBlockContact(contactId: $contactId)
  }
`;
