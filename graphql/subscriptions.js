import { CHAT_DETAILS } from "./queries";

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

export const PARTICIPANTS_ADDED_TO_GROUP_CHAT = gql`
  subscription ParticipantsAddedToGroupChat {
    participantsAddedToGroupChat {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const PARTICIPANTS_REMOVED_FROM_GROUP_CHAT = gql`
  subscription ParticipantsRemovedFromGroupChat {
    participantsRemovedFromGroupChat {
      ...ChatDetails
    }
  }

  ${CHAT_DETAILS}
`;

export const LEFT_GROUP_CHATS = gql`
  subscription LeftChats {
    leftGroupChats
  }
`;

export const CONTACTS_ADDED = gql`
  subscription ContactsAdded {
    contactsAdded {
      id
      username
      name
      about
    }
  }
`;

export const CONTACT_BLOCKED = gql`
  subscription ContactBlocked {
    contactBlocked
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
