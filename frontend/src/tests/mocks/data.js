export const users = [
  {
    __typename: "User",
    id: "1",
    username: "user1",
    name: "User One",
    about: "This is User One profile.",
    image: {
      thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
      original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
    },
    settings: {
      theme: "light",
      time: "24h",
    },
    blockedContacts: [],
  },
  {
    __typename: "User",
    id: "2",
    username: "user2",
    name: "User Two",
    about: "This is User Two profile.",
    image: {
      thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
      original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
    },
    settings: {
      theme: "light",
      time: "24h",
    },
    blockedContacts: [],
  },
  {
    __typename: "User",
    id: "3",
    username: "user3",
    name: "User Three",
    about: "This is User Three profile.",
    image: {
      thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
      original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
    },
    settings: {
      theme: "light",
      time: "24h",
    },
    blockedContacts: [],
  },
];

export const chats = [
  // Private chat example
  {
    __typename: "Chat",
    id: "1",
    title: users[1].name,
    image: {
      __typename: "Image",
      thumbnail: users[1].image.thumbnail,
      original: users[1].image.original,
    },
    description: "",
    isGroupChat: false,
    admin: users[0],
    members: [users[0], users[1]],
    messages: [
      {
        __typename: "Message",
        id: "1",
        type: "message",
        content: "Hello!",
        image: {
          __typename: "Image",
          thumbnail: null,
          original: null,
        },
        sender: users[0],
        isReadBy: [],
        createdAt: "2025-04-07T13:57:53.368Z",
      },
    ],
  },
  // Group chat example
  {
    __typename: "Chat",
    id: "2",
    title: "Test Group Chat",
    image: {
      __typename: "Image",
      thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
      original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
    },
    description: "This is a group chat.",
    isGroupChat: true,
    admin: users[0],
    members: [users[0], users[1], users[2]],
    messages: [
      {
        __typename: "Message",
        id: "1",
        type: "message",
        content: "Welcome to the group chat!",
        image: {
          __typename: "Image",
          thumbnail: null,
          original: null,
        },
        sender: users[0],
        isReadBy: [],
        createdAt: "2025-04-07T14:00:00.000Z",
      },
    ],
  },
];
