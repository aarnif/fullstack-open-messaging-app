import {
  CURRENT_USER,
  FIND_USER_BY_ID,
  ALL_CHATS_BY_USER,
  EVERY_CHAT_BY_USER,
  FIND_CHAT_BY_MEMBERS,
  FIND_CHAT_BY_ID,
  FIND_GROUP_CHAT_BY_TITLE,
  ALL_CONTACTS_EXCEPT_BY_USER,
  ALL_CONTACTS_BY_USER,
  CHECK_IF_USER_HAS_BLOCKED_YOU,
} from "../../graphql/queries";

import { users, chats } from "./data";

const currentUserNullMock = {
  request: {
    query: CURRENT_USER,
  },
  result: {
    data: {
      me: null,
    },
  },
};

const currentUserMock = {
  request: {
    query: CURRENT_USER,
  },
  result: {
    data: {
      me: users[0],
    },
  },
};

const currentUserWithDarkModeMock = {
  request: {
    query: CURRENT_USER,
  },
  result: {
    data: {
      me: {
        ...users[0],
        settings: {
          ...users[0].settings,
          theme: "dark",
        },
      },
    },
  },
};

const findUserByIdMock = {
  request: {
    query: FIND_USER_BY_ID,
    variables: {
      id: users[1].id,
    },
  },
  result: {
    data: {
      findUserById: users[1],
    },
  },
};

const allChatsByUserMock = {
  request: {
    query: ALL_CHATS_BY_USER,
    variables: {
      searchByTitle: "",
    },
  },
  result: {
    data: {
      allChatsByUser: chats,
    },
  },
};

const everyChatByUserMock = {
  request: {
    query: EVERY_CHAT_BY_USER,
    variables: {
      searchByTitle: "",
    },
  },
  result: {
    data: {
      everyChatByUser: chats.map((chat) => ({
        __typename: "UserChat",
        chat: chat,
        unreadMessages: 0,
        lastReadMessageId: null,
        lastReadAt: null,
      })),
    },
  },
};

const findChatByMembersNullMock = {
  request: {
    query: FIND_CHAT_BY_MEMBERS,
    variables: {
      members: [users[0].id, users[1].id],
    },
  },
  result: {
    data: {
      findChatByMembers: null,
    },
  },
};

const findChatByMembersMock = {
  request: {
    query: FIND_CHAT_BY_MEMBERS,
    variables: {
      members: [users[0].id, users[1].id],
    },
  },
  result: {
    data: {
      findChatByMembers: chats[0],
    },
  },
};

const findGroupChatByIdMock = {
  request: {
    query: FIND_CHAT_BY_ID,
    variables: {
      chatId: chats[1].id,
    },
  },
  result: {
    data: {
      findChatById: chats[1],
    },
  },
};

const findGroupChatByTitleNullMock = {
  request: {
    query: FIND_GROUP_CHAT_BY_TITLE,
    variables: {
      title: "Test Group Chat",
    },
  },
  result: {
    data: {
      findGroupChatByTitle: null,
    },
  },
};

const findGroupChatByTitleMock = {
  request: {
    query: FIND_GROUP_CHAT_BY_TITLE,
    variables: {
      title: chats[1].title,
    },
  },
  result: {
    data: {
      findGroupChatByTitle: chats[1],
    },
  },
};

const findPrivateChatByIdMock = {
  request: {
    query: FIND_CHAT_BY_ID,
    variables: {
      chatId: chats[0].id,
    },
  },
  result: {
    data: {
      findChatById: chats[0],
    },
  },
};

const findNewChatByMembersMock = {
  request: {
    query: FIND_CHAT_BY_MEMBERS,
    variables: {
      members: [users[0].id, users[1].id, users[2].id],
    },
  },
  result: {
    data: {
      findChatByMembers: chats[1],
    },
  },
};

const allContactsExceptByUserMock = {
  request: {
    query: ALL_CONTACTS_EXCEPT_BY_USER,
    variables: {
      searchByName: "",
    },
  },
  result: {
    data: {
      allContactsExceptByUser: [users[1], users[2]],
    },
  },
  maxUsageCount: 2,
};

const allContactsExceptByUserSearchMock = {
  request: {
    query: ALL_CONTACTS_EXCEPT_BY_USER,
    variables: {
      searchByName: users[1].name,
    },
  },
  result: {
    data: {
      allContactsExceptByUser: [users[1]],
    },
  },
};

const allContactsByUserMock = {
  request: {
    query: ALL_CONTACTS_BY_USER,
    variables: {
      searchByName: "",
    },
  },
  result: {
    data: {
      allContactsByUser: {
        contacts: [users[1], users[2]],
      },
    },
  },
};

const allContactsByUserSearchMock = {
  request: {
    query: ALL_CONTACTS_BY_USER,
    variables: {
      searchByName: users[1].name,
    },
  },
  result: {
    data: {
      allContactsByUser: {
        contacts: [users[1]],
      },
    },
  },
};

const checkIfUserHasBlockedYouTrueMock = {
  request: {
    query: CHECK_IF_USER_HAS_BLOCKED_YOU,
    variables: {
      userId: users[1].id,
    },
  },
  result: {
    data: {
      checkIfUserHasBlockedYou: true,
    },
  },
};

const checkIfUserHasBlockedYouFalseMock = {
  request: {
    query: CHECK_IF_USER_HAS_BLOCKED_YOU,
    variables: {
      userId: users[1].id,
    },
  },
  result: {
    data: {
      checkIfUserHasBlockedYou: false,
    },
  },
};

const mockSearchWord = {
  value: chats[1].title,
  onChange: vi.fn(),
};

const allContactsByUserMockWithoutSearchWord = {
  ...allContactsByUserMock,
  request: {
    ...allContactsByUserMock.request,
    variables: {},
  },
};

export default {
  currentUserNullMock,
  currentUserMock,
  currentUserWithDarkModeMock,
  findUserByIdMock,
  allChatsByUserMock,
  everyChatByUserMock,
  findChatByMembersNullMock,
  findChatByMembersMock,
  findGroupChatByIdMock,
  findGroupChatByTitleNullMock,
  findGroupChatByTitleMock,
  findPrivateChatByIdMock,
  findNewChatByMembersMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
  allContactsByUserMock,
  allContactsByUserSearchMock,
  allContactsByUserMockWithoutSearchWord,
  checkIfUserHasBlockedYouTrueMock,
  checkIfUserHasBlockedYouFalseMock,
  mockSearchWord,
};
