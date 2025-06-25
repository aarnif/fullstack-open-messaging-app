import { GraphQLError } from "graphql";

import Chat from "../../models/chat.js";
import { getChatTitle, getChatImage } from "../utils.js";

const typeDefs = `
  scalar Date

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
    findChatById(chatId: ID!): Chat
    findChatByMembers(members: [ID!]!): Chat
    findGroupChatByTitle(title: String!): Chat
  }
`;

const resolvers = {
  Query: {
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
        }),
  },
  Chat: {
    title: (parent, args, context) => getChatTitle(parent, context),
    image: (parent, args, context) => getChatImage(parent, context),
  },
};

export default { typeDefs, resolvers };
