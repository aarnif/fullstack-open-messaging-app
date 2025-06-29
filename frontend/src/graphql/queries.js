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
    blockedContacts {
      id
    }
  }
`;

export const CHAT_DETAILS = gql`
  fragment ChatDetails on Chat {
    id
    title
    image {
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
      createdAt
    }
  }

  ${USER_DETAILS}
`;

export const CURRENT_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const FIND_USER_BY_ID = gql`
  query FindUserById($id: ID!) {
    findUserById(id: $id) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const ALL_CHATS_BY_USER = gql`
  query AllChatsByUser($searchByTitle: String) {
    allChatsByUser(searchByTitle: $searchByTitle) {
      chat {
        id
        title
        isGroupChat
        messages {
          id
          type
          sender {
            id
            name
          }
          content
          image {
            thumbnail
            original
          }
          createdAt
        }
        image {
          thumbnail
          original
        }
      }
      unreadMessages
    }
  }
`;

export const ALL_CONTACTS_BY_USER = gql`
  query AllContactsByUser($searchByName: String) {
    allContactsByUser(searchByName: $searchByName) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const ALL_CONTACTS_EXCEPT_BY_USER = gql`
  query AllContactsExceptByUser($searchByName: String) {
    allContactsExceptByUser(searchByName: $searchByName) {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
`;

export const FIND_CHAT_BY_ID = gql`
  query FindChatById($chatId: ID!) {
    findChatById(chatId: $chatId) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const FIND_CHAT_BY_MEMBERS = gql`
  query FindChatByMembers($members: [ID!]!) {
    findChatByMembers(members: $members) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const FIND_GROUP_CHAT_BY_TITLE = gql`
  query FindGroupChatByTitle($title: String!) {
    findGroupChatByTitle(title: $title) {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const CHECK_IF_USER_HAS_BLOCKED_YOU = gql`
  query CheckIfUserHasBlockedYou($userId: ID!) {
    checkIfUserHasBlockedYou(userId: $userId)
  }
`;
