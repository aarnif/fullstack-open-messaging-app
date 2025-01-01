import { CHAT_DETAILS, USER_DETAILS } from "./queries";

import { gql } from "@apollo/client";

export const NEW_MESSAGE_ADDED = gql`
  subscription MessageToChatAdded {
    messageToChatAdded {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const NEW_CHAT_ADDED = gql`
  subscription ChatAdded {
    chatAdded {
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

export const MEMBERS_ADDED_TO_GROUP_CHAT = gql`
  subscription MembersAddedToGroupChat {
    membersAddedToGroupChat {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const MEMBERS_REMOVED_FROM_GROUP_CHAT = gql`
  subscription MembersRemovedFromGroupChat {
    membersRemovedFromGroupChat {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const GROUP_CHAT_MEMBERS_UPDATED = gql`
  subscription GroupChatMembersUpdated {
    groupChatMembersUpdated {
      updatedChat {
        ...ChatDetails
      }
      removedMemberIds
      addedMemberIds
    }
  }

  ${CHAT_DETAILS}
`;

export const LEFT_GROUP_CHATS = gql`
  subscription LeftGroupChats {
    leftGroupChats {
      member
      chatIds
    }
  }
`;

export const CONTACTS_ADDED = gql`
  subscription ContactsAdded {
    contactsAdded {
      ...UserDetails
    }
  }

  ${USER_DETAILS}
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

export const CONTACT_REMOVED = gql`
  subscription ContactRemoved {
    contactRemoved
  }
`;

export const CHAT_EDITED = gql`
  subscription GroupChatUpdated {
    groupChatUpdated {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;
