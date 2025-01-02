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
    countChats: Int!
    allChats: [Chat!]!
    findChatById(chatId: ID!): Chat
    findChatByMembers(members: [ID!]!): Chat
    allChatsByUser(searchByTitle: String): [Chat!]!
    checkIfGroupChatExists(title: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    countChats: async () => Chat.collection.countDocuments(),
    allChats: async () => {
      const chats = await Chat.find({})
        .populate("admin")
        .populate("members")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        });
      return chats;
    },
    findChatById: async (root, args) =>
      Chat.findById(args.chatId)
        .populate("admin")
        .populate("members")
        .populate({
          path: "messages",
          populate: { path: "sender" },
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
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        }),
    allChatsByUser: async (root, args, context) => {
      if (!context.currentUser) {
        return [];
      }

      return Chat.find({
        members: { $in: context.currentUser.id },
        title: {
          $regex: `(?i)${args.searchByTitle ? args.searchByTitle : ""}(?-i)`,
        },
      })
        .populate("admin")
        .populate("members")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        })
        .sort({ "messages.0.createdAt": "desc" });
    },
    checkIfGroupChatExists: async (root, args) => {
      const chatExist = await Chat.findOne({ title: args.title });
      return chatExist ? true : false;
    },
  },
  Chat: {
    title: (parent, args, context) => {
      if (parent.isGroupChat) {
        return parent.title;
      }
      const findOtherPrivateChatMember = parent.members.find(
        (member) => member.id !== context.currentUser.id
      );

      return findOtherPrivateChatMember.name;
    },
  },
};

export default { typeDefs, resolvers };
