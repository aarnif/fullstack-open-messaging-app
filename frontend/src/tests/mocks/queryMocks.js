import {
  CURRENT_USER,
  FIND_USER_BY_ID,
  ALL_CHATS_BY_USER,
  FIND_CHAT_BY_MEMBERS,
  FIND_CHAT_BY_ID,
  FIND_GROUP_CHAT_BY_TITLE,
  ALL_CONTACTS_EXCEPT_BY_USER,
  ALL_CONTACTS_BY_USER,
  CHECK_IF_USER_HAS_BLOCKED_YOU,
} from "../../graphql/queries";

const currentUserMock = {
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
};

const findUserByIdMock = {
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
      allChatsByUser: [
        {
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
                    id: "6690caa54dc3eac2b83517ca",
                    username: "hiker_john",
                  },
                  isRead: false,
                },
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517d6",
                    username: "travel_emma",
                  },
                  isRead: false,
                },
              ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
        {
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b300",
          title: "Travel Buddies",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group for travelers to share experiences, tips, and plan new adventures.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
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
              id: "6690caa54dc3eac2b83517d8",
              username: "history_frank",
              name: "Frank Miller",
              about: "History buff.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                original:
                  "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
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
              id: "67d5875f143d260211e152a9",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
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
                    id: "6690caa54dc3eac2b83517d6",
                    username: "travel_emma",
                  },
                  isRead: false,
                },
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517dc",
                    username: "chef_harry",
                  },
                  isRead: false,
                },
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ca",
                    username: "hiker_john",
                  },
                  isRead: false,
                },
                {
                  __typename: "IsReadBy",
                  member: {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517d8",
                    username: "history_frank",
                  },
                  isRead: false,
                },
              ],
              createdAt: "2025-03-15T13:57:51.023Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be3",
              type: "message",
              content: "Can't wait to make some great memories!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-06T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be4",
              type: "message",
              content: "Me too. This is going to be so much fun.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-06T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be5",
              type: "message",
              content: "Just finished packing. Ready for adventure!",
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
              createdAt: "2024-06-06T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be6",
              type: "message",
              content: "Sounds good. See you all soon!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-06T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be7",
              type: "message",
              content: "Awesome! Let's meet at my place and carpool.",
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
              createdAt: "2024-06-06T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be8",
              type: "message",
              content: "Just checked the weather. It's going to be perfect.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-06T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be9",
              type: "message",
              content: "Ready for the trip of a lifetime!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-06T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bea",
              type: "message",
              content: "Same here. Can't wait to get on the road.",
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
              createdAt: "2024-06-05T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83beb",
              type: "message",
              content: "Packing my bags tonight. Let's do this!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-05T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bec",
              type: "message",
              content: "Good call. I'll bring an extra blanket.",
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
              createdAt: "2024-06-05T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bed",
              type: "message",
              content:
                "Don't forget to pack warm clothes. It might get chilly.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-05T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bee",
              type: "message",
              content: "Just a few more days! So excited.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-04T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bef",
              type: "message",
              content: "Nice! This trip is going to be epic.",
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
              createdAt: "2024-06-04T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf0",
              type: "message",
              content: "I've got a portable speaker for some music too.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-04T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf1",
              type: "message",
              content: "A bonfire sounds fun. Let's do it.",
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
              createdAt: "2024-06-03T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf2",
              type: "message",
              content: "Maybe a bonfire at night? I can bring marshmallows.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-03T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf3",
              type: "message",
              content: "Should we plan any activities besides hiking?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf4",
              type: "message",
              content: "Same here. Can't wait to hit the trails.",
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
              createdAt: "2024-06-03T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf5",
              type: "message",
              content:
                "Nothing specific from my side. Just excited for the trip!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf6",
              type: "message",
              content: "I've got the food sorted. Any dietary preferences?",
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
              createdAt: "2024-06-02T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf7",
              type: "message",
              content: "Awesome! I booked a cozy cabin for us.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf8",
              type: "message",
              content: "Hey guys, found some great trails in the area!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bf9",
              type: "message",
              content: "Perfect! Let's finalize the details by mid-week.",
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
              createdAt: "2024-06-01T12:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bfa",
              type: "message",
              content: "I'll take care of the food and snacks.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bfb",
              type: "message",
              content: "I'll look for a nice cabin to stay in.",
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
              createdAt: "2024-06-01T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bfc",
              type: "message",
              content:
                "Next weekend works for me. I'll check for good hiking trails.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bfd",
              type: "message",
              content: "How about next weekend? We can leave Friday evening.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bfe",
              type: "message",
              content: "Count me in! When should we go?",
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
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bff",
              type: "message",
              content: "I love that idea! Fresh air and beautiful scenery.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83c00",
              type: "message",
              content: "How about a trip to the mountains? We could go hiking.",
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
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83c01",
              type: "message",
              content: "Hey Travel Buddies! Any ideas for our next trip?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b19c",
          title: "Movie Buffs",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group for movie enthusiasts to discuss films, actors, and upcoming releases.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
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
                original:
                  "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
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
                original:
                  "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
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
              id: "67d2a1b3f99fb810c3a83b97",
              type: "message",
              content: "Take care!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T19:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b98",
              type: "message",
              content: "See you all soon!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-03T18:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b99",
              type: "message",
              content: "Looking forward to it. Bye everyone!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T18:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9a",
              type: "message",
              content: "Great. See you all next weekend!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T18:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9b",
              type: "message",
              content: "Awesome. Let's meet again at the same time.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T18:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9c",
              type: "message",
              content: "I love Hitchcock! Let's do it.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T20:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9d",
              type: "message",
              content: "Sounds good. Maybe an old Hitchcock film?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T19:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9e",
              type: "message",
              content: "I'm in. How about a classic next time?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T19:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b9f",
              type: "message",
              content: "Definitely. Let's plan for next weekend.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T19:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba0",
              type: "message",
              content: "That was a great movie. We should do this more often.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T19:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba1",
              type: "message",
              content: "Such a great plot twist!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T18:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba2",
              type: "message",
              content: "Agreed. The special effects are amazing.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T18:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba3",
              type: "message",
              content: "This movie is fantastic!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T18:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba4",
              type: "message",
              content: "Awesome! Let's watch the movie.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba5",
              type: "message",
              content: "Just arrived. Let's get this started!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba6",
              type: "message",
              content: "Arriving in 10 minutes. Ready for movie night!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba7",
              type: "message",
              content: "Everything is set up here. Just waiting for you all.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T16:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba8",
              type: "message",
              content: "I'm on my way. See you soon!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T16:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83ba9",
              type: "message",
              content: "Popcorn is ready too. This is going to be fun.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T16:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83baa",
              type: "message",
              content: "Just got the drinks. Ready for tonight!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T16:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bab",
              type: "message",
              content: "Can't wait! See you all then.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bac",
              type: "message",
              content: "Great! See you all at 7 PM.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bad",
              type: "message",
              content: "7 PM works for me. Looking forward to it!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bae",
              type: "message",
              content: "How about 7 PM? Does that work for everyone?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83baf",
              type: "message",
              content: "I'll bring some drinks. What time should we meet?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb0",
              type: "message",
              content: "Perfect! I'll bring the popcorn.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb1",
              type: "message",
              content: "Sounds good to me. Should we watch it at my place?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb2",
              type: "message",
              content: "I've heard great things about it. I'm in!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb3",
              type: "message",
              content: "How about the new sci-fi movie that just came out?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb4",
              type: "message",
              content:
                "Hey Movie Buffs! What movie should we watch this weekend?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b0e0",
          title: "Photography Crew",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A collective of photographers who share their work and discuss techniques.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
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
              id: "67d2a1b3f99fb810c3a83b76",
              type: "message",
              content: "Take care, everyone! Happy shooting!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-03T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b77",
              type: "message",
              content: "This crew rocks. See you all soon!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-03T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b78",
              type: "message",
              content: "Thanks! Can't wait for our next adventure.",
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
              createdAt: "2024-06-03T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b79",
              type: "message",
              content: "Perfect. I'll create an event for us.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-03T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7a",
              type: "message",
              content:
                "I'm excited! Let's finalize the details later this week.",
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
              createdAt: "2024-06-03T09:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7b",
              type: "message",
              content:
                "Count me in. The gardens should be beautiful this time of year.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-03T09:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7c",
              type: "message",
              content: "Great idea! I've always wanted to take photos there.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-03T09:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7d",
              type: "message",
              content: "How about the botanical gardens next weekend?",
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
              createdAt: "2024-06-03T09:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7e",
              type: "message",
              content:
                "Definitely. Maybe next time we can explore a different location.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T12:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b7f",
              type: "message",
              content:
                "This was such a fun photo walk. We should do this more often.",
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
              createdAt: "2024-06-02T11:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b80",
              type: "message",
              content:
                "Great idea. Let's set up and take some group shots too.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b81",
              type: "message",
              content: "I brought my tripod for some long exposures.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b82",
              type: "message",
              content: "Agreed. Can't wait to capture some stunning shots.",
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
              createdAt: "2024-06-02T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b83",
              type: "message",
              content: "The reflections on the water should be beautiful.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b84",
              type: "message",
              content: "Let's move to the lake next.",
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
              createdAt: "2024-06-02T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b85",
              type: "message",
              content: "This place is amazing. So many photo opportunities.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b86",
              type: "message",
              content: "Got some great shots already!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b87",
              type: "message",
              content: "Good idea. The lighting is perfect there.",
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
              createdAt: "2024-06-02T09:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b88",
              type: "message",
              content: "Let's start with the flower garden.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b89",
              type: "message",
              content: "Just arrived. Waiting by the entrance.",
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
              createdAt: "2024-06-02T09:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8a",
              type: "message",
              content: "I'm on my way. Should be there in 10 minutes.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8b",
              type: "message",
              content: "Yes! The weather is perfect for photography.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T08:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8c",
              type: "message",
              content: "Hey everyone, ready for our photo walk?",
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
              createdAt: "2024-06-02T08:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8d",
              type: "message",
              content: "Looking forward to it. See you all on Saturday!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8e",
              type: "message",
              content: "I'll bring water bottles. Stay hydrated!",
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
              createdAt: "2024-06-01T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b8f",
              type: "message",
              content: "Good call. I'll also bring some snacks.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b90",
              type: "message",
              content: "Perfect. Don't forget to bring extra batteries.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b91",
              type: "message",
              content: "I'm in! Let's meet at the park entrance at 9 AM.",
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
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b92",
              type: "message",
              content: "Sounds great! I need to test my new lens.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b93",
              type: "message",
              content: "How about a photo walk in the park?",
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
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b94",
              type: "message",
              content: "Hey Photography Crew! Any plans for this weekend?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b29a",
          title: "Fitness Freaks",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group of fitness enthusiasts sharing workouts, nutrition tips, and motivation.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
            },
            {
              __typename: "User",
              id: "6690caa54dc3eac2b83517d4",
              username: "fit_david",
              name: "David Wilson",
              about: "Fitness enthusiast.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                original:
                  "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
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
                original:
                  "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
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
                original:
                  "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
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
              id: "67d2a1b3f99fb810c3a83bcd",
              type: "message",
              content: "Great session today! Let's keep pushing ourselves.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bce",
              type: "message",
              content: "I'm hitting the squats first.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bcf",
              type: "message",
              content: "Let's do it! I'll start with some bench presses.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T17:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd0",
              type: "message",
              content: "Ready for some strength training?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T16:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd1",
              type: "message",
              content: "Perfect. See you all at the gym.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T07:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd2",
              type: "message",
              content: "I'll bring the protein shakes!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T07:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd3",
              type: "message",
              content: "Sounds good. Let's meet at the gym at 5 PM.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T07:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd4",
              type: "message",
              content:
                "Great run, everyone! How about some strength training next?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T07:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd5",
              type: "message",
              content: "Let's go! 5k, here we come!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T06:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd6",
              type: "message",
              content: "Warm-up done. Ready to start the run?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T06:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd7",
              type: "message",
              content: "Absolutely! Let's get warmed up.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T06:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd8",
              type: "message",
              content: "Morning everyone! Ready for our run?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T05:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bd9",
              type: "message",
              content: "Looking forward to it. Let's smash our goals!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bda",
              type: "message",
              content: "Got it! See you all tomorrow morning.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bdb",
              type: "message",
              content: "Perfect. Don't forget to bring water and a towel.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bdc",
              type: "message",
              content: "I'm up for it! Let's meet at the park at 6 AM.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bdd",
              type: "message",
              content: "Cardio sounds great. How about a 5k run?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bde",
              type: "message",
              content: "I'm in! Should we start with some cardio?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bdf",
              type: "message",
              content: "Absolutely! What's the plan for tomorrow?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83be0",
              type: "message",
              content:
                "Hey Fitness Freaks! Ready for our workout session tomorrow?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b066",
          title: "Cooking Lovers",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group for those who enjoy cooking and sharing recipes and culinary tips.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
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
                original:
                  "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
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
              id: "6690caa54dc3eac2b83517d4",
              username: "fit_david",
              name: "David Wilson",
              about: "Fitness enthusiast.",
              image: {
                __typename: "Image",
                thumbnail:
                  "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                original:
                  "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
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
              id: "67d2a1b3f99fb810c3a83b60",
              type: "message",
              content: "Looking forward to it!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b61",
              type: "message",
              content: "Same here. See you all soon!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b62",
              type: "message",
              content: "No restrictions here! Ready for an Italian feast.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b63",
              type: "message",
              content:
                "Just a reminder, if anyone has dietary restrictions, let me know.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b64",
              type: "message",
              content:
                "Everything is coming together nicely. See you all soon!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b65",
              type: "message",
              content: "Just finished making the tiramisu. It looks great!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b66",
              type: "message",
              content:
                "I'm sure it'll be delicious. How's the salad coming along?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b67",
              type: "message",
              content: "I hope everyone loves the pasta I'm making.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b68",
              type: "message",
              content: "Don't forget to bring your appetite!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:55:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b69",
              type: "message",
              content: "Can't wait! See you all on Saturday.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:50:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b6a",
              type: "message",
              content: "Sounds good to me. I'll see you all then.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b6b",
              type: "message",
              content: "Let's meet at my place at 6 PM on Saturday.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b6c",
              type: "message",
              content: "This is going to be an amazing dinner!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
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
              id: "67d2a1b3f99fb810c3a83b6d",
              type: "message",
              content: "Yum! I'll bring some good wine to pair with the food.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b6e",
              type: "message",
              content: "I'll handle the dessert. Tiramisu, anyone?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
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
              id: "67d2a1b3f99fb810c3a83b6f",
              type: "message",
              content: "Great idea! I'll prepare a Caprese salad.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b70",
              type: "message",
              content: "Perfect! I'll make homemade pasta.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d4",
                username: "fit_david",
                name: "David Wilson",
                about: "Fitness enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/SV2DWBX/6690caa54dc3eac2b83517d4.png",
                  original:
                    "https://i.ibb.co/r5gKTHG/6690caa54dc3eac2b83517d4.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b71",
              type: "message",
              content: "Italian sounds delicious. I'm in!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
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
              id: "67d2a1b3f99fb810c3a83b72",
              type: "message",
              content: "How about a themed dinner? Italian night!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
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
              id: "67d2a1b3f99fb810c3a83b73",
              type: "message",
              content: "Hey Cooking Lovers! What should we cook this weekend?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57ae4c",
          title: "Book Club",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A club for avid readers to discuss and share their thoughts on various books.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
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
              id: "67d2a1b3f99fb810c3a83af4",
              type: "message",
              content: "Me too! See you all on Saturday!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af5",
              type: "message",
              content: "I'm so excited for our discussion.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af6",
              type: "message",
              content: "Same here! It's such a powerful story.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T09:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af7",
              type: "message",
              content: "Just finished the book! It's amazing.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af8",
              type: "message",
              content: "Agreed! See you all on Saturday.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83af9",
              type: "message",
              content:
                "Great! Let's keep going and we'll have a lot to talk about.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T09:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83afa",
              type: "message",
              content: "I'm almost done. Can't wait to discuss it.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83afb",
              type: "message",
              content: "I just started, but I'm loving it so far.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83afc",
              type: "message",
              content: "I'm halfway through. It's really good!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-02T09:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83afd",
              type: "message",
              content: "Hey guys, how far have you gotten with the book?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-02T09:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83afe",
              type: "message",
              content: "Can't wait! Happy reading, everyone.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83aff",
              type: "message",
              content: "Awesome! I'll see you all next Saturday then.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b00",
              type: "message",
              content: "I'll bring some snacks!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b01",
              type: "message",
              content: "Yes, the coffee shop sounds perfect.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b02",
              type: "message",
              content: "That works for me. Should we meet at the usual place?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b03",
              type: "message",
              content: "How about next Saturday at 3 PM?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b04",
              type: "message",
              content: "I'm in! When should we meet to discuss it?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b05",
              type: "message",
              content: "That's a great choice! I've been meaning to read it.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b06",
              type: "message",
              content:
                "How about 'To Kill a Mockingbird'? I've heard great things about it.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b07",
              type: "message",
              content: "Hey everyone, what book should we read next?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57aeb2",
          title: "Gaming Night",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A group dedicated to organizing and enjoying weekly gaming sessions.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
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
                original:
                  "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
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
          ],
          messages: [
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0a",
              type: "message",
              content: "I'm up for it. See you guys next week!",
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
              createdAt: "2024-06-01T21:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0b",
              type: "message",
              content: "Count me in. This was a blast!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0c",
              type: "message",
              content: "Definitely. How about same time next week?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0d",
              type: "message",
              content: "We should do this more often.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0e",
              type: "message",
              content: "Teamwork makes the dream work!",
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
              createdAt: "2024-06-01T21:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b0f",
              type: "message",
              content: "Can't believe we pulled off that comeback.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b10",
              type: "message",
              content: "Yeah, we really nailed that last round!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b11",
              type: "message",
              content: "Great game, guys! That was intense.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T21:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b12",
              type: "message",
              content: "Ready to play! Let's do this.",
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
              createdAt: "2024-06-01T20:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b13",
              type: "message",
              content: "I'm in too. Let's go team!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b14",
              type: "message",
              content: "Joining now! Let's get this started.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b15",
              type: "message",
              content: "Hey everyone, I'm online now. Ready when you are!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b16",
              type: "message",
              content: "Looking forward to it. See you all at 8!",
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
              createdAt: "2024-06-01T19:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b17",
              type: "message",
              content:
                "Snacks sound great! I'll make sure my internet is working well.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b18",
              type: "message",
              content: "8 PM works for me. I'll bring snacks!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b19",
              type: "message",
              content: "Great! Let's meet online at 8 PM then.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b1a",
              type: "message",
              content: "Rocket League sounds fun! I'm in.",
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
              createdAt: "2024-06-01T19:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b1b",
              type: "message",
              content: "I'm up for some Rocket League. How about you guys?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d2",
                username: "streamer_charlie",
                name: "Charlie Clark",
                about: "Gamer and streamer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
                  original:
                    "https://i.ibb.co/GHzvQbN/6690caa54dc3eac2b83517d2.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b1c",
              type: "message",
              content: "Absolutely! What game are we playing tonight?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b1d",
              type: "message",
              content: "Hey everyone, ready for Gaming Night?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57afce",
          title: "Music Band",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A band of musicians collaborating on new music and sharing their passion.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
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
                original:
                  "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
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
              id: "67d2a1b3f99fb810c3a83b40",
              type: "message",
              content: "Take care, everyone!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b41",
              type: "message",
              content: "Bye everyone! Have a great evening.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b42",
              type: "message",
              content: "Great session today. See you soon!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b43",
              type: "message",
              content: "Sounds perfect. See you all at the next practice.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b44",
              type: "message",
              content: "Works for me. Let's stick to that plan.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b45",
              type: "message",
              content: "How about we practice every other day until the gig?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T20:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b46",
              type: "message",
              content: "I'm in. Let's set up a schedule.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:55:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b47",
              type: "message",
              content: "Definitely. Let's have a few more practice sessions.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:50:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b48",
              type: "message",
              content: "Great. Let's make sure we're well-rehearsed by then.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b49",
              type: "message",
              content: "Two weeks sounds perfect. I'll check with the venue.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4a",
              type: "message",
              content: "Yes, let's do that. How about in two weeks?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4b",
              type: "message",
              content: "Before we wrap up, should we plan our next gig?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4c",
              type: "message",
              content: "Can't wait for that. It's going to be awesome.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4d",
              type: "message",
              content: "Definitely. Let's record a demo next week.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4e",
              type: "message",
              content: "Agreed. This song is going to be a hit.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b4f",
              type: "message",
              content: "Sounds good to me. Practice makes perfect!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b50",
              type: "message",
              content: "Glad you like it. Let's practice it a few more times.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b51",
              type: "message",
              content: "Perfect. This song is coming together nicely.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T19:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b52",
              type: "message",
              content:
                "These lyrics are great. Let's fit them into the melody.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:55:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b53",
              type: "message",
              content:
                "Sure, I have a few lines written down. Let me share them.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:50:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b54",
              type: "message",
              content: "I like it! Let's work on the lyrics next.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b55",
              type: "message",
              content: "That's interesting. Let's give it a try.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b56",
              type: "message",
              content: "Here it is. I was thinking of a mix of rock and jazz.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b57",
              type: "message",
              content: "Great warm-up. Now, let's hear that new song idea.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b58",
              type: "message",
              content: "Let's do this!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b59",
              type: "message",
              content: "Sounds good. Ready when you are!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b5a",
              type: "message",
              content: "Good idea. Let's play our usual warm-up tune.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b5b",
              type: "message",
              content: "Can't wait to hear it! Let's start with a warm-up.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517da",
                username: "photo_grace",
                name: "Grace Martin",
                about: "Photographer.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
                  original:
                    "https://i.ibb.co/vsJL8Rn/6690caa54dc3eac2b83517da.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b5c",
              type: "message",
              content: "Yes! I have a new song idea to share.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d0",
                username: "music_bob",
                name: "Bob Brown",
                about: "Musician and artist.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
                  original:
                    "https://i.ibb.co/qkp1CF6/6690caa54dc3eac2b83517d0.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b5d",
              type: "message",
              content: "Hey everyone, ready for band practice?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T18:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57b234",
          title: "Tech Geeks",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A community for tech enthusiasts to discuss the latest in technology and gadgets.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
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
              id: "67d2a1b3f99fb810c3a83bb7",
              type: "message",
              content: "Will do! See you soon, Tech Geeks!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T13:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb8",
              type: "message",
              content:
                "Don't forget to bring your gadgets for a hands-on session.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T13:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bb9",
              type: "message",
              content: "Can't wait! It's going to be fun.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T13:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bba",
              type: "message",
              content: "Looking forward to it. See you then!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T13:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bbb",
              type: "message",
              content: "I'll bring the new device. See you all on Saturday!",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T12:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bbc",
              type: "message",
              content: "Works for me. I'll bring some snacks.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T12:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bbd",
              type: "message",
              content: "Great idea! How about this Saturday at my place?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T12:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bbe",
              type: "message",
              content:
                "Let's plan a meetup to try out the new features together.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T12:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bbf",
              type: "message",
              content:
                "Most likely, but it might run better on the new hardware.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc0",
              type: "message",
              content:
                "Can't wait to test it out. Do you think it'll be available on older models?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T11:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc1",
              type: "message",
              content:
                "Yes, I saw the demo. It seems to make editing so much easier.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc2",
              type: "message",
              content: "The new AI-driven photo editing app looks promising.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T11:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc3",
              type: "message",
              content:
                "What about software? Any new apps or features you're excited about?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc4",
              type: "message",
              content: "True. The camera upgrades are always tempting.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc5",
              type: "message",
              content:
                "I think it might be worth it for the new camera system alone.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc6",
              type: "message",
              content:
                "Depends on what you're looking for. The performance boost seems significant.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc7",
              type: "message",
              content:
                "Agreed. Do you think it's worth upgrading from last year's model?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc8",
              type: "message",
              content:
                "I'm excited to try out the new hardware. The specs are impressive.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517dc",
                username: "chef_harry",
                name: "Harry Thompson",
                about: "Chef and food critic.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
                  original:
                    "https://i.ibb.co/WgyhRwz/6690caa54dc3eac2b83517dc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bc9",
              type: "message",
              content:
                "Yes! The new features look amazing. Especially the AI enhancements.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83bca",
              type: "message",
              content:
                "Hey Tech Geeks! Did you see the latest release from Apple?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:00:00.000Z",
            },
          ],
        },
        {
          __typename: "Chat",
          id: "6690cc6331f8d4e66b57af18",
          title: "Yoga Enthusiasts",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
          },
          description:
            "A community of yoga lovers who share tips, routines, and support each other.",
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
              blockedContacts: [
                {
                  __typename: "User",
                  id: "6690caa54dc3eac2b83517ce",
                },
              ],
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
                original:
                  "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
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
                original:
                  "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
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
              id: "67d2a1b3f99fb810c3a83b20",
              type: "message",
              content: "Will do! Thanks for the reminder.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b21",
              type: "message",
              content:
                "Remember to practice your balance poses during the week.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b22",
              type: "message",
              content: "See you next time!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b23",
              type: "message",
              content: "Take care, everyone!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b24",
              type: "message",
              content: "Bye everyone! Have a great week.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T09:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b25",
              type: "message",
              content: "Great job today! See you all next week.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T09:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b26",
              type: "message",
              content: "Thanks, everyone! Looking forward to the next one.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:55:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b27",
              type: "message",
              content: "Feeling relaxed and refreshed. Great session!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:50:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b28",
              type: "message",
              content: "Perfect way to end the session. Thanks for leading.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T08:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b29",
              type: "message",
              content: "Let's finish with some deep breathing and relaxation.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2a",
              type: "message",
              content: "This is really helpful. Thanks, everyone!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2b",
              type: "message",
              content: "Thanks for the tip. Feeling more stable already.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2c",
              type: "message",
              content: "Tree pose is a great choice. Feeling grounded.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T08:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2d",
              type: "message",
              content: "Exactly. Let's start with the tree pose.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2e",
              type: "message",
              content: "Focus on a fixed point and breathe steadily. It helps!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b2f",
              type: "message",
              content: "I could use some help with balance. Any tips?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b30",
              type: "message",
              content: "Balance poses are my favorite. Let's do it.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T08:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b31",
              type: "message",
              content: "You're welcome! Let's try some balance poses next.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T08:00:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b32",
              type: "message",
              content: "This is fantastic. Thanks for organizing this.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:55:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b33",
              type: "message",
              content: "Feeling the stretch! It's challenging but rewarding.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:50:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b34",
              type: "message",
              content: "Feeling great! Loving the session so far.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T07:45:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b35",
              type: "message",
              content:
                "Let's move on to some deeper stretches. How's everyone feeling?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:40:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b36",
              type: "message",
              content: "Feeling good already. Thanks for the guidance.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:35:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b37",
              type: "message",
              content: "Same here. Let's get started!",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:30:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b38",
              type: "message",
              content: "Great idea. I'll follow your lead.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T07:25:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b39",
              type: "message",
              content:
                "Awesome! Let's start with some gentle stretches to warm up.",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:20:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b3a",
              type: "message",
              content:
                "Sounds great to me. I've been wanting to improve my flexibility.",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517d8",
                username: "history_frank",
                name: "Frank Miller",
                about: "History buff.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
                  original:
                    "https://i.ibb.co/SvvV0qx/6690caa54dc3eac2b83517d8.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:15:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b3b",
              type: "message",
              content: "Morning! How about we focus on flexibility today?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
                __typename: "User",
                id: "6690caa54dc3eac2b83517cc",
                username: "bookworm_jane",
                name: "Jane Smith",
                about: "Avid reader and coffee enthusiast.",
                image: {
                  __typename: "Image",
                  thumbnail:
                    "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
                  original:
                    "https://i.ibb.co/wYXCyNj/6690caa54dc3eac2b83517cc.png",
                },
                settings: {
                  __typename: "Settings",
                  theme: "light",
                  time: "24h",
                },
                blockedContacts: [],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:10:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b3c",
              type: "message",
              content:
                "Good morning! I'm excited for today's session. What's the focus?",
              image: {
                __typename: "Image",
                thumbnail: "",
                original: "",
              },
              sender: {
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
              isReadBy: [],
              createdAt: "2024-06-01T07:05:00.000Z",
            },
            {
              __typename: "Message",
              id: "67d2a1b3f99fb810c3a83b3d",
              type: "message",
              content:
                "Good morning, everyone! Ready for our yoga session today?",
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
                blockedContacts: [
                  {
                    __typename: "User",
                    id: "6690caa54dc3eac2b83517ce",
                  },
                ],
              },
              isReadBy: [],
              createdAt: "2024-06-01T07:00:00.000Z",
            },
          ],
        },
      ],
    },
  },
};

const findChatByMembersNullMock = {
  request: {
    query: FIND_CHAT_BY_MEMBERS,
    variables: {
      members: ["6690caa44dc3eac2b83517c7", "6690caa54dc3eac2b83517ce"],
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
  },
};

const findGroupChatByIdMock = {
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
            content: "Absolutely! Looking forward to it. See you all tomorrow!",
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
            content: "Yes! I'm really looking forward to it. What's the plan?",
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
      title: "Test Group Chat",
    },
  },
  result: {
    data: {
      findGroupChatByTitle: {
        __typename: "Chat",
        id: "67f3d9e15b5ec0457e8d19ed",
        title: "Test Group Chat",
        image: {
          __typename: "Image",
          thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
          original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
        },
        description: "This is a test group chat",
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
        ],
        messages: [],
      },
    },
  },
};

const findPrivateChatByIdMock = {
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
  },
};

const findNewChatByMembersMock = {
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
      allContactsExceptByUser: [
        {
          __typename: "User",
          id: "6690caa54dc3eac2b83517ce",
          username: "techie_alice",
          name: "Alice Jones",
          about: "Tech geek and foodie.",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
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
            thumbnail: "https://i.ibb.co/GcRP93m/6690caa54dc3eac2b83517d0.png",
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
            thumbnail: "https://i.ibb.co/MBFDk3Q/6690caa54dc3eac2b83517d2.png",
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
        {
          __typename: "User",
          id: "6690caa54dc3eac2b83517d8",
          username: "history_frank",
          name: "Frank Miller",
          about: "History buff.",
          image: {
            __typename: "Image",
            thumbnail: "https://i.ibb.co/HggGYm2/6690caa54dc3eac2b83517d8.png",
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
            thumbnail: "https://i.ibb.co/DG7wnT2/6690caa54dc3eac2b83517da.png",
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
            thumbnail: "https://i.ibb.co/pJz7k8K/6690caa54dc3eac2b83517dc.png",
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
            thumbnail: "https://i.ibb.co/0QSZqjv/6690caa54dc3eac2b83517cc.png",
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
};

const allContactsExceptByUserSearchMock = {
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
            thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
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
        contacts: [
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
};

const allContactsByUserSearchMock = {
  request: {
    query: ALL_CONTACTS_BY_USER,
    variables: {
      searchByName: "Alice Jones",
    },
  },
  result: {
    data: {
      allContactsByUser: {
        contacts: [
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
};

const checkIfUserHasBlockedYouTrueMock = {
  request: {
    query: CHECK_IF_USER_HAS_BLOCKED_YOU,
    variables: {
      userId: "6690caa54dc3eac2b83517ce",
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
      userId: "6690caa54dc3eac2b83517ce",
    },
  },
  result: {
    data: {
      checkIfUserHasBlockedYou: false,
    },
  },
};

const mockSearchWord = {
  value: "Travel",
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
  currentUserMock,
  findUserByIdMock,
  allChatsByUserMock,
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
