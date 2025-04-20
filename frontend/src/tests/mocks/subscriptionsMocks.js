import {
  CONTACT_BLOCKED_OR_UNBLOCKED,
  GROUP_CHAT_EDITED,
  NEW_CHAT_CREATED,
  NEW_MESSAGE_TO_CHAT_ADDED,
  LEFT_GROUP_CHATS,
  CHAT_DELETED,
} from "../../graphql/subscriptions";

import { users, chats } from "./data";

const contactBlockedOrUnBlockedMock = {
  request: {
    query: CONTACT_BLOCKED_OR_UNBLOCKED,
  },
  result: {
    data: {
      contactBlockedOrUnBlocked: {
        isBlocked: true,
        actor: "1",
        target: users[1],
        __typename: "blockedOrUnBlocked",
      },
    },
  },
};

const groupChatEditedMock = {
  request: {
    query: GROUP_CHAT_EDITED,
  },
  result: {
    data: {
      groupChatEdited: {
        updatedChat: chats[1],
        removedMemberIds: [],
        addedMemberIds: [],
        __typename: "groupChatEditedDetails",
      },
    },
  },
};

const newChatCreated = {
  request: {
    query: NEW_CHAT_CREATED,
  },
  result: {
    data: {
      newChatCreated: chats[1],
    },
  },
};

const newMessageToChatAddedMock = {
  request: {
    query: NEW_MESSAGE_TO_CHAT_ADDED,
  },
  result: {
    data: {
      messageToChatAdded: chats[1],
    },
  },
};

const leftGroupChatsMock = {
  request: {
    query: LEFT_GROUP_CHATS,
  },
  result: {
    data: {
      leftGroupChats: {
        memberId: "1",
        chatIds: ["2"],
      },
    },
  },
};

const chatDeletedMock = {
  request: {
    query: CHAT_DELETED,
  },
  result: {
    data: {
      chatDeleted: "1",
    },
  },
};

export default {
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
  newChatCreated,
  newMessageToChatAddedMock,
  leftGroupChatsMock,
  chatDeletedMock,
};
