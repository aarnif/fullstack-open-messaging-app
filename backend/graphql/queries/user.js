import User from "../../models/user.js";

import { GraphQLError } from "graphql";

const typeDefs = `
  scalar Date

  type Settings {
    theme: String
    time: String
  }

  type UserChat {
    chat: Chat!
    unreadMessages: Int!
    lastReadMessageId: ID
    lastReadAt: Date
  }

  type User {
    id: ID!
    username: String!
    name: String
    about: String
    image: Image
    status: String!
    settings: Settings
    createdAt: Date!
    contacts: [User!]!
    blockedContacts: [User!]!
    chats: [UserChat!]!
  }

  type Token {
    value: String!
  }

  extend type Query {
    findUserById(id: ID!): User
    everyChatByUser(searchByTitle: String): [UserChat!]!
    allContactsByUser(searchByName: String): User!
    allContactsExceptByUser(searchByName: String): [User!]!
    checkIfUserHasBlockedYou(userId: ID!): Boolean
    me: User
  }
`;

const resolvers = {
  Query: {
    findUserById: async (root, args) =>
      User.findById(args.id)
        .populate("chats")
        .populate({
          path: "chats",
          populate: { path: "messages" },
        })
        .populate("blockedContacts")
        .catch((error) => {
          throw new GraphQLError("Invalid id!", {
            extensions: {
              code: "INVALID_ID",
              invalidArgs: args.id,
              error,
            },
          });
        }),
    everyChatByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }
      const user = await User.findById(context.currentUser.id).populate({
        path: "chats.chat",
        match: {
          title: {
            $regex: `(?i)${args.searchByTitle}(?-i)`,
          },
        },
        populate: [
          { path: "admin" },
          { path: "members" },
          {
            path: "members",
            populate: { path: "blockedContacts" },
          },
          {
            path: "messages",
            populate: { path: "sender" },
          },
          {
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          },
        ],
      });

      return !user.chats.length
        ? []
        : user.chats
            .filter((userChat) => userChat.chat !== null)
            .sort((a, b) => {
              if (!a.chat.messages.length) return 1;

              if (!b.chat.messages.length) return -1;

              return (
                new Date(b.chat.messages[0].createdAt) -
                new Date(a.chat.messages[0].createdAt)
              );
            });
    },
    allContactsByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const searchRegex = args.searchByName || "";

      return User.findById(context.currentUser)
        .populate({
          path: "contacts",
          match: {
            $or: [
              { name: { $regex: searchRegex, $options: "i" } },
              { username: { $regex: searchRegex, $options: "i" } },
            ],
          },
          options: { sort: { name: "asc", username: "asc" } },
          populate: { path: "blockedContacts" },
        })
        .populate("blockedContacts")
        .sort({ name: "asc", username: "asc" });
    },
    allContactsExceptByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const searchTerm = args.searchByName || "";

      return User.find({
        _id: {
          $ne: context.currentUser.id,
          $nin: context.currentUser.contacts,
        },
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { username: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .populate("blockedContacts")
        .sort({ name: "asc", username: "asc" });
    },
    checkIfUserHasBlockedYou: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      if (!args.userId) {
        throw new GraphQLError("User ID is required", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.userId,
          },
        });
      }

      try {
        const user = await User.findById(args.userId);

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.userId,
            },
          });
        }

        return user.blockedContacts.some(
          (blockedId) =>
            blockedId.toString() === context.currentUser.id.toString()
        );
      } catch (error) {
        throw new GraphQLError("Error checking block status", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
    },
    me: async (root, args, context) =>
      User.findById(context.currentUser).populate("blockedContacts"),
  },
};

export default { typeDefs, resolvers };
