import {
  LOGIN,
  CREATE_USER,
  EDIT_SETTINGS,
  EDIT_PROFILE,
  MARK_MESSAGES_IN_CHAT_READ,
  ADD_MESSAGE_TO_CHAT,
  CREATE_CHAT,
  ADD_CONTACTS,
} from "../../graphql/mutations";
import {
  CURRENT_USER,
  FIND_USER_BY_ID,
  FIND_CHAT_BY_MEMBERS,
  FIND_CHAT_BY_ID,
  ALL_CONTACTS_EXCEPT_BY_USER,
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

  {
    request: {
      query: FIND_CHAT_BY_ID,
      variables: {
        chatId: "6690cc6331f8d4e66b57ae22",
      },
    },
    result: {
      data: {
        findChatById: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae22",
          title: "Weekend Hikers",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group of enthusiasts who love to explore trails and mountains every weekend.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
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
              id: "67d2a1b3f99fb810c3a83ae8",
              type: "message",
              content: "See you all tomorrow! Get a good night's rest.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ae9",
              type: "message",
              content:
                "Absolutely! Looking forward to it. See you all tomorrow!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aea",
              type: "message",
              content:
                "Sounds good! Let's make sure to take some breaks and enjoy the view.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aeb",
              type: "message",
              content:
                "Great, I'll bring some fruits and a first-aid kit just in case.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aec",
              type: "message",
              content: "I'll bring some granola bars and extra water bottles.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aed",
              type: "message",
              content: "8 AM works for me. What about snacks and water?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aee",
              type: "message",
              content:
                "Yes, let's meet at the trailhead at 8 AM. Does that work for everyone?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aef",
              type: "message",
              content: "Count me in! Should we meet at the usual spot?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af0",
              type: "message",
              content:
                "Yes! I'm really looking forward to it. What's the plan?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af1",
              type: "message",
              content: "Hey everyone, are we still on for hiking this weekend?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
      },
    },
  },

  {
    request: {
      query: FIND_CHAT_BY_ID,
      variables: {
        chatId: "67f3d9e15b5ec0457e8d19ed",
      },
    },
    result: {
      data: {
        findChatById: {
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

  {
    request: {
      query: MARK_MESSAGES_IN_CHAT_READ,
      variables: {
        chatId: "6690cc6331f8d4e66b57ae22",
      },
    },
    result: {
      data: {
        markAllMessagesInChatRead: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae22",
          title: "Weekend Hikers",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group of enthusiasts who love to explore trails and mountains every weekend.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
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
              id: "67d2a1b3f99fb810c3a83ae8",
              type: "message",
              content: "See you all tomorrow! Get a good night's rest.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ae9",
              type: "message",
              content:
                "Absolutely! Looking forward to it. See you all tomorrow!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aea",
              type: "message",
              content:
                "Sounds good! Let's make sure to take some breaks and enjoy the view.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aeb",
              type: "message",
              content:
                "Great, I'll bring some fruits and a first-aid kit just in case.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aec",
              type: "message",
              content: "I'll bring some granola bars and extra water bottles.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aed",
              type: "message",
              content: "8 AM works for me. What about snacks and water?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aee",
              type: "message",
              content:
                "Yes, let's meet at the trailhead at 8 AM. Does that work for everyone?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aef",
              type: "message",
              content: "Count me in! Should we meet at the usual spot?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af0",
              type: "message",
              content:
                "Yes! I'm really looking forward to it. What's the plan?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af1",
              type: "message",
              content: "Hey everyone, are we still on for hiking this weekend?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
      },
    },
    maxUsageCount: 2,
  },

  {
    request: {
      query: MARK_MESSAGES_IN_CHAT_READ,
      variables: {
        chatId: "67f3d9e15b5ec0457e8d19ed",
      },
    },
    result: {
      data: {
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
              original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
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
    maxUsageCount: 2,
  },

  {
    request: {
      query: ADD_MESSAGE_TO_CHAT,
      variables: {
        chatId: "6690cc6331f8d4e66b57ae22",
        content: "This is a test.",
        input: { thumbnail: null, original: null },
      },
    },
    result: {
      data: {
        addMessageToChat: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae22",
          title: "Weekend Hikers",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group of enthusiasts who love to explore trails and mountains every weekend.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
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
              id: "67f949b5ee1ad20bb84776a6",
              type: "message",
              content: "This is a test.",
              image: {
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
                  thumbnail: null,
                  original: null,
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2025-04-11T16:56:21.905Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ae8",
              type: "message",
              content: "See you all tomorrow! Get a good night's rest.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ae9",
              type: "message",
              content:
                "Absolutely! Looking forward to it. See you all tomorrow!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aea",
              type: "message",
              content:
                "Sounds good! Let's make sure to take some breaks and enjoy the view.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aeb",
              type: "message",
              content:
                "Great, I'll bring some fruits and a first-aid kit just in case.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aec",
              type: "message",
              content: "I'll bring some granola bars and extra water bottles.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aed",
              type: "message",
              content: "8 AM works for me. What about snacks and water?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aee",
              type: "message",
              content:
                "Yes, let's meet at the trailhead at 8 AM. Does that work for everyone?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aef",
              type: "message",
              content: "Count me in! Should we meet at the usual spot?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af0",
              type: "message",
              content:
                "Yes! I'm really looking forward to it. What's the plan?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af1",
              type: "message",
              content: "Hey everyone, are we still on for hiking this weekend?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
      },
    },
  },

  {
    request: {
      query: CREATE_CHAT,
      variables: {
        title: "New Group Chat",
        description: "This is a group chat.",
        memberIds: [
          "6690caa44dc3eac2b83517c7",
          "6690caa54dc3eac2b83517ca",
          "6690caa54dc3eac2b83517d6",
        ],
      },
    },
    result: {
      data: {
        createChat: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae99",
          title: "New Group Chat",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description: "This is a group chat.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
          ],
          messages: [],
        },
      },
    },
  },

  {
    request: {
      query: ADD_MESSAGE_TO_CHAT,
      variables: {
        chatId: "6690cc6331f8d4e66b57ae99",
        content: "This is a first message.",
        senderId: "6690caa44dc3eac2b83517c7",
        input: { thumbnail: null, original: null },
      },
    },
    result: {
      data: {
        addMessageToChat: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae99",
          title: "New Group Chat",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description: "This is a group chat.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
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
              id: "67d2a1b3f99fb810c3a83be9",
              type: "message",
              content: "This is a first message.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
      },
    },
  },

  {
    request: {
      query: FIND_CHAT_BY_MEMBERS,
      variables: {
        members: [
          "6690caa44dc3eac2b83517c7",
          "6690caa54dc3eac2b83517ca",
          "6690caa54dc3eac2b83517d6",
        ],
      },
    },
    result: {
      data: {
        findChatByMembers: {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae99",
          title: "New Group Chat",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description: "This is a group chat.",
          isGroupChat: true,
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
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
              },
              settings: {
                __typename: "Settings",
                theme: "light",
                time: "24h",
              },
              blockedContacts: [],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
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
              id: "67d2a1b3f99fb810c3a83be9",
              type: "message",
              content: "This is a first message.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
      },
    },
  },

  {
    request: {
      query: ALL_CONTACTS_EXCEPT_BY_USER,
      variables: {
        searchByName: "",
      },
    },
    result: {
      data: {
        allContactsExceptByUser: [
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
              original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d0",
            username: "music_bob",
            name: "Bob Brown",
            about: "Musician and artist.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
              original: "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d2",
            username: "streamer_charlie",
            name: "Charlie Clark",
            about: "Gamer and streamer.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
              original: "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d6",
            username: "travel_emma",
            name: "Emma Davis",
            about: "Travel blogger.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
              original: "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d8",
            username: "history_frank",
            name: "Frank Miller",
            about: "History buff.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
              original: "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517da",
            username: "photo_grace",
            name: "Grace Martin",
            about: "Photographer.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
              original: "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517dc",
            username: "chef_harry",
            name: "Harry Thompson",
            about: "Chef and food critic.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
              original: "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517cc",
            username: "bookworm_jane",
            name: "Jane Smith",
            about: "Avid reader and coffee enthusiast.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
              original: "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517ca",
            username: "hiker_john",
            name: "John Doe",
            about: "Love hiking and outdoor adventures.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
              original:
                "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
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
            id: "67d587f9a1ac8a94656663fa",
            username: "user1",
            name: "User1",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a94656663fc",
            username: "user2",
            name: "User2",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a9465666402",
            username: "user3",
            name: "User3",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a9465666400",
            username: "user4",
            name: "User4",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a94656663fe",
            username: "user5",
            name: "User5",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
        ],
      },
    },
  },

  {
    request: {
      query: ALL_CONTACTS_EXCEPT_BY_USER,
      variables: {
        searchByName: "Alice Jones",
      },
    },
    result: {
      data: {
        allContactsExceptByUser: [
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
              original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
        ],
      },
    },
  },

  {
    request: {
      query: ADD_CONTACTS,
      variables: {
        userIds: [
          "6690caa54dc3eac2b83517ce",
          "6690caa54dc3eac2b83517d0",
          "6690caa54dc3eac2b83517d2",
        ],
      },
    },
    result: {
      data: {
        addContacts: [
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
              original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d0",
            username: "music_bob",
            name: "Bob Brown",
            about: "Musician and artist.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
              original: "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d2",
            username: "streamer_charlie",
            name: "Charlie Clark",
            about: "Gamer and streamer.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
              original: "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d6",
            username: "travel_emma",
            name: "Emma Davis",
            about: "Travel blogger.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
              original: "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517d8",
            username: "history_frank",
            name: "Frank Miller",
            about: "History buff.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
              original: "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517da",
            username: "photo_grace",
            name: "Grace Martin",
            about: "Photographer.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
              original: "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517dc",
            username: "chef_harry",
            name: "Harry Thompson",
            about: "Chef and food critic.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
              original: "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517cc",
            username: "bookworm_jane",
            name: "Jane Smith",
            about: "Avid reader and coffee enthusiast.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
              original: "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "6690caa54dc3eac2b83517ca",
            username: "hiker_john",
            name: "John Doe",
            about: "Love hiking and outdoor adventures.",
            image: {
              __typename: "Image",
              thumbnail:
                "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
              original:
                "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
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
            id: "67d587f9a1ac8a94656663fa",
            username: "user1",
            name: "User1",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a94656663fc",
            username: "user2",
            name: "User2",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a9465666402",
            username: "user3",
            name: "User3",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a9465666400",
            username: "user4",
            name: "User4",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
          {
            __typename: "User",
            id: "67d587f9a1ac8a94656663fe",
            username: "user5",
            name: "User5",
            about: "Hey there! I'm using this app!",
            image: {
              __typename: "Image",
              thumbnail: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
              original: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
            },
            settings: {
              __typename: "Settings",
              theme: "light",
              time: "24h",
            },
            blockedContacts: [],
          },
        ],
      },
    },
  },
];

const mockSearchWord = {
  value: "Travel",
  onChange: vi.fn(),
};

const mockNewChatInfo = {
  title: "New Group Chat",
  description: "This is a group chat.",
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
      id: "6690caa54dc3eac2b83517ca",
      username: "hiker_john",
      name: "John Doe",
      about: "Love hiking and outdoor adventures.",
      image: {
        __typename: "Image",
        thumbnail: "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
        original:
          "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
      },
      settings: {
        __typename: "Settings",
        theme: "light",
        time: "24h",
      },
      blockedContacts: [],
    },
    {
      __typename: "User",
      id: "6690caa54dc3eac2b83517d6",
      username: "travel_emma",
      name: "Emma Davis",
      about: "Travel blogger.",
      image: {
        __typename: "Image",
        thumbnail: "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
        original: "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
      },
      settings: {
        __typename: "Settings",
        theme: "light",
        time: "24h",
      },
      blockedContacts: [],
    },
  ],
  image: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
};

const [
  loginMock,
  createUserMock,
  editSettingsMock,
  currentUserMock,
  findUserByIdMock,
  editProfileMock,
  findChatByMembersMock,
  groupChatMock,
  privateChatMock,
  markAllMessagesInGroupChatReadMock,
  markAllMessagesInPrivateChatReadMock,
  addMessageToChatMock,
  createNewChatMock,
  addMessageToNewChatMock,
  findNewChatByMembersMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
  addContactsMock,
] = mockData;

export default {
  loginMock,
  createUserMock,
  editSettingsMock,
  currentUserMock,
  findUserByIdMock,
  editProfileMock,
  findChatByMembersMock,
  groupChatMock,
  privateChatMock,
  markAllMessagesInGroupChatReadMock,
  markAllMessagesInPrivateChatReadMock,
  addMessageToChatMock,
  createNewChatMock,
  addMessageToNewChatMock,
  findNewChatByMembersMock,
  allContactsExceptByUserMock,
  allContactsExceptByUserSearchMock,
  addContactsMock,
  mockSearchWord,
  mockNewChatInfo,
};
