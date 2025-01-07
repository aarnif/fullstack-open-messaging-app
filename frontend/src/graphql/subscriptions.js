import { CHAT_DETAILS } from "./queries";

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

export const MESSAGES_IN_CHAT_READ = gql`
  subscription MessagesInChatRead {
    messagesInChatRead {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
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
      target
    }
  }
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
