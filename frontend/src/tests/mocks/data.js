import {
  LOGIN,
  CREATE_USER,
  EDIT_SETTINGS,
  EDIT_PROFILE,
} from "../../graphql/mutations";
import {
  CURRENT_USER,
  FIND_USER_BY_ID,
  FIND_CHAT_BY_MEMBERS,
} from "../../graphql/queries";

const mockData = [
  {
    request: {
      query: LOGIN,
      variables: { username: "test", password: "password" },
    },
    result: {
      data: {
        login: {
          value: "fake-token-12345",
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER,
      variables: {
        username: "test",
        password: "password",
        confirmPassword: "password",
      },
    },
    result: {
      data: {
        createUser: {
          __typename: "User",
          username: "test",
          name: "Test",
        },
      },
    },
  },
  {
    request: {
      query: EDIT_SETTINGS,
      variables: { theme: "light", time: "24h" },
    },
    result: {
      data: {
        editSettings: {
          __typename: "User",
          id: "6690caa44dc3eac2b83517c7",
          username: "test",
          name: "Test User",
          about: "Test user for development purposes.",
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
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data: {
        me: {
          __typename: "User",
          id: "6690caa44dc3eac2b83517c7",
          username: "test",
          name: "Test User",
          about: "Test user for development purposes.",
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
      },
    },
  },
  {
    request: {
      query: FIND_USER_BY_ID,
      variables: {
        id: "6690caa54dc3eac2b83517ce",
      },
    },
    result: {
      data: {
        findUserById: {
          __typename: "User",
          id: "6690caa54dc3eac2b83517ce",
          username: "techie_alice",
          name: "Alice Jones",
          about: "Tech geek and foodie.",
          image: {
            thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
            original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
          },
          settings: {
            theme: "light",
            time: "24h",
          },
          blockedContacts: [],
        },
      },
    },
  },
  {
    request: {
      query: EDIT_PROFILE,
      variables: {
        name: "Test User",
        about: "Test user for development purposes.",
        input: {
          thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
          original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
        },
      },
      result: {
        data: {
          editProfile: {
            __typename: "User",
            id: "6690caa44dc3eac2b83517c7",
            username: "test",
            name: "Test User",
            about: "Test user for development purposes.",
            image: {
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              theme: "dark",
              time: "24h",
            },
            blockedContacts: [],
          },
        },
      },
    },
  },
  {
    request: {
      query: FIND_CHAT_BY_MEMBERS,
      variables: {
        members: ["6690caa44dc3eac2b83517c7", "6690caa54dc3eac2b83517ce"],
      },
    },
    result: {
      data: {
        findChatByMembers: {
          __typename: "Chat",
          id: "67f3d9e15b5ec0457e8d19ed",
          title: "Alice Jones",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
            original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
          },
          description: "",
          isGroupChat: false,
          admin: {
            __typename: "User",
            id: "6690caa44dc3eac2b83517c7",
            username: "test",
            name: "Test User",
            about: "This is a test user.",
          },
          members: [
            {
              __typename: "User",
              id: "6690caa44dc3eac2b83517c7",
              username: "test",
              name: "Test User",
              about: "This is a test user.",
              image: {
                __typename: "Image",
                thumbnail: null,
                original: null,
              },
              settings: {
                __typename: "Settings",
                theme: "dark",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517ce",
              username: "techie_alice",
              name: "Alice Jones",
              about: "Tech geek and foodie.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
                original:
                  "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
          ],
          messages: [
            {
              __typename: "Message",
              id: "67f3d9e15b5ec0457e8d19ff",
              type: "message",
              content: "Hello!",
              image: {
                __typename: "Image",
                thumbnail: null,
                original: null,
              },
              sender: {
                __typename: "User",
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  __typename: "Image",
                  thumbnail: null,
                  original: null,
                },
                settings: {
                  __typename: "Settings",
                  theme: "dark",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa44dc3eac2b83517c7",
                    username: "test",
                  },
                  isRead: true,
                },
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                    username: "techie_alice",
                  },
                  isRead: false,
                },
              ],
              createdAt: "2025-04-07T13:57:53.368Z",
            },
          ],
        },
      },
    },
  },
];

const mockSearchWord = {
  value: "Travel",
  onChange: vi.fn(),
};

const [
  loginMock,
  createUserMock,
  editSettingsMock,
  currentUserMock,
  findUserByIdMock,
  editProfileMock,
  findChatByMembersMock,
] = mockData;

export default {
  loginMock,
  createUserMock,
  editSettingsMock,
  currentUserMock,
  findUserByIdMock,
  editProfileMock,
  findChatByMembersMock,
  mockSearchWord,
};
