import { CHAT_DETAILS, USER_DETAILS } from "./queries";

import { gql } from "@apollo/client";

export const NEW_MESSAGE_TO_CHAT_ADDED = gql`
  subscription MessageToChatAdded {
    messageToChatAdded {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const NEW_CHAT_CREATED = gql`
  subscription NewChatCreated {
    newChatCreated {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const CHAT_DELETED = gql`
  subscription ChatDeleted {
    chatDeleted
  }
`;

export const LEFT_GROUP_CHATS = gql`
  subscription LeftGroupChats {
    leftGroupChats {
      memberId
      chatIds
    }
  }
`;

export const CONTACT_BLOCKED_OR_UNBLOCKED = gql`
  subscription ContactBlockedOrUnBlocked {
    contactBlockedOrUnBlocked {
      isBlocked
      actor
      target {
        ...UserDetails
      }
    }
  }
  ${USER_DETAILS}
`;

export const GROUP_CHAT_EDITED = gql`
  subscription GroupChatEdited {
    groupChatEdited {
      updatedChat {
        ...ChatDetails
      }
      removedMemberIds
      addedMemberIds
    }
  }

  ${CHAT_DETAILS}
`;

export const UNREAD_MESSAGE_ADDED = gql`
  subscription UnreadMessageAdded {
    unreadMessageAdded {
      userId
      chatId
      messageId
    }
  }
`;
