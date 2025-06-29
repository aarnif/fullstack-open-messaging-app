import {
  LOGIN,
  CREATE_USER,
  EDIT_SETTINGS,
  EDIT_PROFILE,
  ADD_MESSAGE_TO_CHAT,
  CREATE_CHAT,
  DELETE_CHAT,
  ADD_CONTACTS,
  BLOCK_OR_UNBLOCK_CONTACT,
  REMOVE_CONTACT,
  CHANGE_PASSWORD,
  LEAVE_GROUP_CHATS,
  EDIT_GROUP_CHAT,
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
      name: users[0].name,
      about: users[0].about,
      input: {
        thumbnail: users[0].image.thumbnail,
        original: users[0].image.original,
      },
    },
    result: {
      data: {
        editProfile: {
          ...users[0],
        },
      },
    },
  },
};

const addMessageToChatMock = {
  request: {
    query: ADD_MESSAGE_TO_CHAT,
    variables: {
      chatId: "2",
      content: "Hello, this is a test message!",
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
            content: "Hello, this is a test message!",
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
      initialMessage: {
        type: "message",
        content: "Hello, this is a test message!",
      },
    },
  },
  result: {
    data: {
      createChat: chats[1],
    },
  },
};

const createNewChatWithImageOnlyMock = {
  request: {
    query: CREATE_CHAT,
    variables: {
      title: "Test Group Chat",
      description: "This is a group chat.",
      memberIds: [users[0].id, users[1].id, users[2].id],
      initialMessage: {
        type: "message",
        content: "",
      },
    },
  },
  result: {
    data: {
      createChat: chats[1],
    },
  },
};

const deleteChatMock = {
  request: {
    query: DELETE_CHAT,
    variables: {
      chatId: chats[1].id,
    },
  },
  result: {
    data: {
      deleteChat: chats[1].id,
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

const changePasswordMock = {
  request: {
    query: CHANGE_PASSWORD,
    variables: {
      currentPassword: "password",
      newPassword: "new_password",
      confirmNewPassword: "new_password",
    },
  },
  result: {
    data: {
      changePassword: users[0],
    },
  },
};

const leaveGroupChatMock = {
  request: {
    query: LEAVE_GROUP_CHATS,
    variables: {
      chatIds: [chats[1].id],
    },
  },
  result: {
    data: {
      leaveGroupChats: [chats[1].id],
    },
  },
};

const editGroupChatMock = {
  request: {
    query: EDIT_GROUP_CHAT,
    variables: {
      chatId: chats[1].id,
      title: "Updated Chat Title",
      description: "Updated Chat Description",
      input: {
        thumbnail: chats[1].image.thumbnail,
        original: chats[1].image.original,
      },
      memberIds: [users[0].id, users[1].id, users[2].id],
    },
  },
  result: {
    data: {
      editGroupChat: {
        ...chats[1],
        title: "Updated Chat Title",
        description: "Updated Chat Description",
      },
    },
  },
};

const mockNewChatInfo = {
  title: "Test Group Chat",
  description: "This is a group chat.",
  members: [users[0], users[1], users[2]],
  image: chats[1].image,
  initialMessage: {
    id: "1",
    type: "notification",
    content: "Start a chat by sending a message",
  },
};

export default {
  loginMock,
  createUserMock,
  editSettingsMock,
  editProfileMock,
  addMessageToChatMock,
  createNewChatMock,
  createNewChatWithImageOnlyMock,
  deleteChatMock,
  addContactMock,
  addContactsMock,
  blockOrUnblockContactMock,
  removeContactMock,
  changePasswordMock,
  leaveGroupChatMock,
  editGroupChatMock,
  mockNewChatInfo,
};
