import {
  CONTACT_BLOCKED_OR_UNBLOCKED,
  GROUP_CHAT_EDITED,
} from "../../graphql/subscriptions";

const contactBlockedOrUnBlockedMock = {
  request: {
    query: CONTACT_BLOCKED_OR_UNBLOCKED,
  },
  result: {
    data: {
      contactBlockedOrUnBlocked: {
        isBlocked: true,
        actor: "6690caa44dc3eac2b83517c7",
        target: {
          id: "6690caa54dc3eac2b83517ce",
          username: "techie_alice",
          name: "Alice Jones",
          about: "Tech geek and foodie.",
          image: {
            thumbnail: "https://i.ibb.co/YBz3jdp/6690caa54dc3eac2b83517ce.png",
            original: "https://i.ibb.co/r2Cmyp4/6690caa54dc3eac2b83517ce.png",
            __typename: "Image",
          },
          settings: {
            theme: "light",
            time: "24h",
            __typename: "Settings",
          },
          blockedContacts: [],
          __typename: "User",
        },
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
        updatedChat: {
          id: "6690cc6331f8d4e66b57ae22",
          title: "Weekend Hikers",
          image: {
            thumbnail: "https://i.ibb.co/bRb0SYw/chat-placeholder.png",
            original: "https://i.ibb.co/FqHrScZ/chat-placeholder.png",
            __typename: "Image",
          },
          description:
            "A group of enthusiasts who love to explore trails and mountains every weekend.",
          isGroupChat: true,
          admin: {
            id: "6690caa44dc3eac2b83517c7",
            username: "test",
            name: "Test User",
            about: "This is a test user.",
            __typename: "User",
          },
          members: [
            {
              id: "6690caa44dc3eac2b83517c7",
              username: "test",
              name: "Test User",
              about: "This is a test user.",
              image: {
                thumbnail: null,
                original: null,
                __typename: "Image",
              },
              settings: {
                theme: "dark",
                time: "24h",
                __typename: "Settings",
              },
              blockedContacts: [
                {
                  id: "6690caa54dc3eac2b83517ce",
                  __typename: "User",
                },
              ],
              __typename: "User",
            },
            {
              id: "6690caa54dc3eac2b83517ca",
              username: "hiker_john",
              name: "John Doe",
              about: "Love hiking and outdoor adventures.",
              image: {
                thumbnail:
                  "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                original:
                  "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                __typename: "Image",
              },
              settings: {
                theme: "light",
                time: "24h",
                __typename: "Settings",
              },
              blockedContacts: [],
              __typename: "User",
            },
            {
              id: "6690caa54dc3eac2b83517d6",
              username: "travel_emma",
              name: "Emma Davis",
              about: "Travel blogger.",
              image: {
                thumbnail:
                  "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                original:
                  "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                __typename: "Image",
              },
              settings: {
                theme: "light",
                time: "24h",
                __typename: "Settings",
              },
              blockedContacts: [],
              __typename: "User",
            },
          ],
          messages: [
            {
              id: "67f949b5ee1ad20bb84776a6",
              type: "message",
              content: "This is a test.",
              image: {
                thumbnail: null,
                original: null,
                __typename: "Image",
              },
              sender: {
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  thumbnail: null,
                  original: null,
                  __typename: "Image",
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [
                  {
                    id: "6690caa54dc3eac2b83517ce",
                    __typename: "User",
                  },
                ],
                __typename: "User",
              },
              isReadBy: [
                {
                  member: {
                    id: "6690caa44dc3eac2b83517c7",
                    username: "test",
                    __typename: "User",
                  },
                  isRead: true,
                  __typename: "IsReadBy",
                },
                {
                  member: {
                    id: "6690caa54dc3eac2b83517ca",
                    username: "hiker_john",
                    __typename: "User",
                  },
                  isRead: false,
                  __typename: "IsReadBy",
                },
                {
                  member: {
                    id: "6690caa54dc3eac2b83517d6",
                    username: "travel_emma",
                    __typename: "User",
                  },
                  isRead: false,
                  __typename: "IsReadBy",
                },
              ],
              createdAt: "2025-04-11T16:56:21.905Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83ae8",
              type: "message",
              content: "See you all tomorrow! Get a good night's rest.",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  thumbnail: null,
                  original: null,
                  __typename: "Image",
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [
                  {
                    id: "6690caa54dc3eac2b83517ce",
                    __typename: "User",
                  },
                ],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:45:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83ae9",
              type: "message",
              content:
                "Absolutely! Looking forward to it. See you all tomorrow!",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:40:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aea",
              type: "message",
              content:
                "Sounds good! Let's make sure to take some breaks and enjoy the view.",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:35:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aeb",
              type: "message",
              content:
                "Great, I'll bring some fruits and a first-aid kit just in case.",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  thumbnail: null,
                  original: null,
                  __typename: "Image",
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [
                  {
                    id: "6690caa54dc3eac2b83517ce",
                    __typename: "User",
                  },
                ],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:30:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aec",
              type: "message",
              content: "I'll bring some granola bars and extra water bottles.",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:25:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aed",
              type: "message",
              content: "8 AM works for me. What about snacks and water?",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:20:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aee",
              type: "message",
              content:
                "Yes, let's meet at the trailhead at 8 AM. Does that work for everyone?",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  thumbnail: null,
                  original: null,
                  __typename: "Image",
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [
                  {
                    id: "6690caa54dc3eac2b83517ce",
                    __typename: "User",
                  },
                ],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:15:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83aef",
              type: "message",
              content: "Count me in! Should we meet at the usual spot?",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517d6",
                username: "travel_emma",
                name: "Emma Davis",
                about: "Travel blogger.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/nDQkfL2/6690caa54dc3eac2b83517d6.png",
                  original:
                    "https://i.ibb.co/rZ5yMwP/6690caa54dc3eac2b83517d6.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:10:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83af0",
              type: "message",
              content:
                "Yes! I'm really looking forward to it. What's the plan?",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa54dc3eac2b83517ca",
                username: "hiker_john",
                name: "John Doe",
                about: "Love hiking and outdoor adventures.",
                image: {
                  thumbnail:
                    "https://i.ibb.co/gRT6j6Z/6690caa54dc3eac2b83517ca.png",
                  original:
                    "https://i.ibb.co/Tg8rvrM/g-RT6j6-Z-6690caa54dc3eac2b83517ca.png",
                  __typename: "Image",
                },
                settings: {
                  theme: "light",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:05:00.000Z",
              __typename: "Message",
            },
            {
              id: "67d2a1b3f99fb810c3a83af1",
              type: "message",
              content: "Hey everyone, are we still on for hiking this weekend?",
              image: {
                thumbnail: "",
                original: "",
                __typename: "Image",
              },
              sender: {
                id: "6690caa44dc3eac2b83517c7",
                username: "test",
                name: "Test User",
                about: "This is a test user.",
                image: {
                  thumbnail: null,
                  original: null,
                  __typename: "Image",
                },
                settings: {
                  theme: "dark",
                  time: "24h",
                  __typename: "Settings",
                },
                blockedContacts: [
                  {
                    id: "6690caa54dc3eac2b83517ce",
                    __typename: "User",
                  },
                ],
                __typename: "User",
              },
              isReadBy: [],
              createdAt: "2024-06-01T10:00:00.000Z",
              __typename: "Message",
            },
          ],
          __typename: "Chat",
        },
        removedMemberIds: [],
        addedMemberIds: [],
        __typename: "groupChatEditedDetails",
      },
    },
  },
};

export default {
  contactBlockedOrUnBlockedMock,
  groupChatEditedMock,
};
