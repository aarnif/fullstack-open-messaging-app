import User from "../../models/user.js";

import { GraphQLError } from "graphql";

const typeDefs = `
  scalar Date

  type Settings {
    theme: String
    time: String
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
    chats: [Chat!]!
  }

  type Token {
    value: String!
  }

  extend type Query {
    findUserById(id: ID!): User
    allContactsByUser(searchByName: String): User
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
    allContactsByUser: async (root, args, context) =>
      User.findById(context.currentUser)
        .populate({
          path: "contacts",
          match: {
            $or: [
              {
                name: {
                  $regex: args.searchByName ? `${args.searchByName}` : "",
                  $options: "i",
                },
              },
              {
                username: {
                  $regex: args.searchByName ? `${args.searchByName}` : "",
                  $options: "i",
                },
              },
            ],
          },
          options: {
            sort: { name: "asc", username: "asc" },
          },
          populate: { path: "blockedContacts" },
        })
        .populate("blockedContacts"),
    allContactsExceptByUser: async (root, args, context) =>
      User.find({
        $and: [
          {
            _id: {
              $ne: context.currentUser,
            },
          },
          {
            _id: {
              $nin: context.currentUser.contacts,
            },
          },
        ],
        $or: [
          {
            name: {
              $regex: `(?i)${args.searchByName}(?-i)`,
            },
          },
          {
            username: {
              $regex: `(?i)${args.searchByName}(?-i)`,
            },
          },
        ],
      })
        .populate("blockedContacts")
        .sort({ name: "asc", username: "asc" }),
    checkIfUserHasBlockedYou: async (root, args, context) => {
      const user = await User.findById(args.userId).populate("blockedContacts");
      return user.blockedContacts.includes(context.currentUser.id);
    },
    me: async (root, args, context) =>
      User.findById(context.currentUser).populate("blockedContacts"),
  },
};

export default { typeDefs, resolvers };
