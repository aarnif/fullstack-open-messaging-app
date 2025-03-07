import Chat from "../../models/chat.js";

import { GraphQLError } from "graphql";

const typeDefs = `
  scalar Date

  type IsReadBy {
    member: User
    isRead: Boolean
  }

  type Image {
    thumbnail: String
    original: String
  }

  type Message {
    id: ID!
    type: String
    sender: User!
    content: String
    image: Image
    isReadBy: [IsReadBy!]!
    createdAt: Date
  }

  type Chat {
    id: ID!
    title: String
    image: Image
    description: String
    isGroupChat: Boolean
    admin: User
    members: [User!]!
    messages: [Message!]!
    latestMessage: Message
    createdAt: Date
  }

  extend type Query {
    allChatsByUser(searchByTitle: String): [Chat!]!
    findChatById(chatId: ID!): Chat
    findChatByMembers(members: [ID!]!): Chat
    findGroupChatByTitle(title: String!): Chat
  }
`;

const resolvers = {
  Query: {
    allChatsByUser: async (root, args, context) =>
      !context.currentUser
        ? []
        : Chat.find({
            members: { $in: context.currentUser.id },
            title: {
              $regex: args.searchByTitle
                ? `(?i)${args.searchByTitle}(?-i)`
                : "(?i)(?-i)",
            },
          })
            .populate("admin")
            .populate("members")
            .populate({
              path: "members",
              populate: { path: "blockedContacts" },
            })
            .populate({
              path: "messages",
              populate: { path: "sender" },
            })
            .populate({
              path: "messages.sender",
              populate: { path: "blockedContacts" },
            })
            .populate({
              path: "messages",
              populate: { path: "isReadBy.member" },
            })
            .sort({ "messages.0.createdAt": "desc" }),
    findChatById: async (root, args) =>
      Chat.findById(args.chatId)
        .populate("admin")
        .populate("members")
        .populate({
          path: "members",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages.sender",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        })
        .catch((error) => {
          throw new GraphQLError("Invalid id!", {
            extensions: {
              code: "INVALID_ID",
              invalidArgs: args.chatId,
              error,
            },
          });
        }),
    findChatByMembers: async (root, args) =>
      Chat.findOne({ members: args.members })
        .populate("admin")
        .populate("members")
        .populate({
          path: "members",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages.sender",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        }),
    findGroupChatByTitle: async (root, args) =>
      Chat.findOne({ title: args.title, isGroupChat: true })
        .populate("admin")
        .populate("members")
        .populate({
          path: "members",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages.sender",
          populate: { path: "blockedContacts" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        }),
  },
  Chat: {
    title: (parent, args, context) => {
      if (!context.currentUser || parent.isGroupChat) {
        return parent.title;
      }
      // The title of a private chat is always the name of the other member, not the current user.
      const findOtherPrivateChatMember = parent.members.find(
        (member) => member.id !== context.currentUser.id
      );
      return findOtherPrivateChatMember.name;
    },
    image: (parent, args, context) => {
      if (parent.isGroupChat) {
        return parent.image;
      }
      // The image of a private chat is always the image of the other member, not the current user.
      const findOtherPrivateChatMember = parent.members.find(
        (member) => member.id !== context.currentUser.id
      );
      return findOtherPrivateChatMember.image;
    },
  },
};

export default { typeDefs, resolvers };
