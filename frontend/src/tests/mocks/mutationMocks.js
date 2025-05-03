import {
  LOGIN,
  CREATE_USER,
  EDIT_SETTINGS,
  EDIT_PROFILE,
  MARK_MESSAGES_IN_CHAT_READ,
  ADD_MESSAGE_TO_CHAT,
  CREATE_CHAT,
  ADD_CONTACTS,
  BLOCK_OR_UNBLOCK_CONTACT,
  REMOVE_CONTACT,
} from "../../graphql/mutations";

import { users, chats } from "./data";

const loginMock = {
  request: {
    query: LOGIN,
    variables: { username: "user1", password: "password" },
  },
  result: {
    data: {
      login: {
        value: "fake-token-12345",
      },
    },
  },
};

const createUserMock = {
  request: {
    query: CREATE_USER,
    variables: {
      username: "user1",
      password: "password",
      confirmPassword: "password",
    },
  },
  result: {
    data: {
      createUser: {
        __typename: "User",
        username: "user1",
        name: "User One",
      },
    },
  },
};

const editSettingsMock = {
  request: {
    query: EDIT_SETTINGS,
    variables: { theme: "light", time: "24h" },
  },
  result: {
    data: {
      editSettings: users[0],
    },
  },
};

const editProfileMock = {
  request: {
    query: EDIT_PROFILE,
    variables: {
      name: "Edited User One",
      about: "This is User One profile. This is another line.",
      input: {
        thumbnail: "edited-thumbnail-url",
        original: "edited-original-url",
      },
    },
    result: {
      data: {
        editProfile: {
          ...users[0],
          name: "Edited User One",
          about: "This is User One profile. This is another line.",
          image: {
            ...users[0].image,
            thumbnail: "edited-thumbnail-url",
            original: "edited-original-url",
          },
        },
      },
    },
  },
};

const markAllMessagesInPrivateChatReadMock = {
  request: {
    query: MARK_MESSAGES_IN_CHAT_READ,
    variables: {
      chatId: chats[0].id,
    },
  },
  result: {
    data: {
      markAllMessagesInChatRead: chats[0],
    },
  },
  maxUsageCount: 2,
};

const markAllMessagesInGroupChatReadMock = {
  request: {
    query: MARK_MESSAGES_IN_CHAT_READ,
    variables: {
      chatId: chats[1].id,
    },
  },
  result: {
    data: {
      markAllMessagesInChatRead: chats[1],
    },
  },
  maxUsageCount: 2,
};

const addMessageToChatMock = {
  request: {
    query: ADD_MESSAGE_TO_CHAT,
    variables: {
      chatId: "2",
      content: "This is a test.",
      input: { thumbnail: null, original: null },
    },
  },
  result: {
    data: {
      addMessageToChat: {
        ...chats[1],
        messages: [
          {
            __typename: "Message",
            id: "2",
            type: "message",
            content: "This is a test.",
            image: {
              __typename: "Image",
              thumbnail: null,
              original: null,
            },
            sender: users[0],
            isReadBy: [],
            createdAt: new Date().toISOString(),
          },
        ],
      },
    },
  },
};

const createNewChatMock = {
  request: {
    query: CREATE_CHAT,
    variables: {
      title: "Test Group Chat",
      description: "This is a group chat.",
      memberIds: [users[0].id, users[1].id, users[2].id],
    },
  },
  result: {
    data: {
      createChat: chats[1],
    },
  },
};

const addMessageToNewChatMock = {
  request: {
    query: ADD_MESSAGE_TO_CHAT,
    variables: {
      chatId: "2",
      content: "Welcome to the group chat!",
      senderId: users[0].id,
      input: { thumbnail: null, original: null },
    },
  },
  result: {
    data: {
      addMessageToChat: chats[1],
    },
  },
};

const addContactMock = {
  request: {
    query: ADD_CONTACTS,
    variables: {
      userIds: [users[1].id],
    },
  },
  result: {
    data: {
      addContacts: {
        id: users[0].id,
        username: users[0].username,
        name: users[0].name,
        contacts: [users[1]],
      },
    },
  },
};

const addContactsMock = {
  request: {
    query: ADD_CONTACTS,
    variables: {
      userIds: [users[1].id, users[2].id],
    },
  },
  result: {
    data: {
      addContacts: {
        id: users[0].id,
        username: users[0].username,
        name: users[0].name,
        contacts: [users[1], users[2]],
      },
    },
  },
};

const blockOrUnblockContactMock = {
  request: {
    query: BLOCK_OR_UNBLOCK_CONTACT,
    variables: {
      contactId: users[1].id,
    },
  },
  result: {
    data: {
      blockOrUnBlockContact: true,
    },
  },
};

const removeContactMock = {
  request: {
    query: REMOVE_CONTACT,
    variables: {
      contactId: users[1].id,
    },
  },
  result: {
    data: {
      removeContact: true,
    },
  },
};

const mockNewChatInfo = {
  title: "Test Group Chat",
  description: "This is a group chat.",
  members: [users[0], users[1], users[2]],
  image: chats[1].image,
};

export default {
  loginMock,
  createUserMock,
  editSettingsMock,
  editProfileMock,
  markAllMessagesInGroupChatReadMock,
  markAllMessagesInPrivateChatReadMock,
  addMessageToChatMock,
  createNewChatMock,
  addMessageToNewChatMock,
  addContactMock,
  addContactsMock,
  blockOrUnblockContactMock,
  removeContactMock,
  mockNewChatInfo,
};
