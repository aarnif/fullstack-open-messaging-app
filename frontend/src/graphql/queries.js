import { gql } from "@apollo/client";

export const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
    name
    about
    image {
      thumbnail
      original
    }
    settings {
      theme
      time
    }
    blockedContacts
  }
`;

export const CHAT_DETAILS = gql`
  fragment ChatDetails on Chat {
    id
    title
    displayChatTitle
    image {
      thumbnail
      original
    }
    displayChatImage {
      thumbnail
      original
    }
    description
    isGroupChat
    admin {
      id
      username
      name
      about
    }
    members {
      ...UserDetails
    }
    messages {
      id
      type
      content
      image {
        thumbnail
        original
      }
      sender {
        ...UserDetails
      }
      isReadBy {
        member {
          id
          username
        }
        isRead
      }
      createdAt
    }
  }

  ${USER_DETAILS}
`;

export const GET_ALL_USERS = gql`
  query AllUsers($searchByName: String) {
    allUsers(searchByName: $searchByName) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const GET_CURRENT_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const GET_USER_BY_ID = gql`
  query FindUserById($id: ID!) {
    findUserById(id: $id) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const GET_CHATS_BY_USER = gql`
  query AllChatsByUser($searchByTitle: String) {
    allChatsByUser(searchByTitle: $searchByTitle) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const GET_CONTACTS_BY_USER = gql`
  query AllContactsByUser($searchByName: String) {
    allContactsByUser(searchByName: $searchByName) {
      contacts {
        ...UserDetails
      }
    }
  }

  ${USER_DETAILS}
`;

export const GET_ALL_CONTACTS_EXCEPT_BY_USER = gql`
  query AllContactsExceptByUser($searchByName: String) {
    allContactsExceptByUser(searchByName: $searchByName) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const GET_CHAT_BY_ID = gql`
  query FindChatById($chatId: ID!) {
    findChatById(chatId: $chatId) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const GET_CHAT_BY_MEMBERS = gql`
  query FindChatByMembers($members: [ID!]!) {
    findChatByMembers(members: $members) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const CHECK_IF_GROUP_CHAT_EXISTS = gql`
  query CheckIfGroupChatExists($title: String!) {
    checkIfGroupChatExists(title: $title)
  }
`;

export const CHECK_IF_USER_HAS_BLOCKED_YOU = gql`
  query CheckIfUserHasBlockedYou($userId: ID!) {
    checkIfUserHasBlockedYou(userId: $userId)
  }
`;
