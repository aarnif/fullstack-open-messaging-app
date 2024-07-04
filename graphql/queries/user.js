import User from "../../models/user.js";

import { GraphQLError } from "graphql";

const typeDefs = `
  scalar Date
  type User {
    id: ID!
    username: String!
    name: String
    about: String
    profilePicture: String
    status: String!
    createdAt: Date!
    contacts: [User!]!
    chats: [Chat!]!
  }

  type Token {
    value: String!
  }

  extend type Query {
    countUsers: Int!
    allUsers(searchByName: String): [User!]!
    findUserById(id: ID!): User
    allContactsByUser(searchByName: String): User
    allContactsExceptByUser(searchByName: String): [User!]!
    me: User
  }
`;

const resolvers = {
  Query: {
    countUsers: async () => User.collection.countDocuments(),
    allUsers: async (root, args) =>
      User.find({
        $or: [
          {
            name: {
              $regex: `(?i)${args.searchByName ? args.searchByName : ""}(?-i)`,
            },
          },
          {
            username: {
              $regex: `(?i)${args.searchByName ? args.searchByName : ""}(?-i)`,
            },
          },
        ],
      })
        .populate("contacts")
        .populate("chats")
        .populate({
          path: "chats",
          populate: { path: "messages" },
        }),
    findUserById: async (root, args) =>
      User.findById(args.id)
        .populate("chats")
        .populate({
          path: "chats",
          populate: { path: "messages" },
        })
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
      User.findById(context.currentUser).populate({
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
      }),
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
      }),
    me: async (root, args, context) => context.currentUser,
  },
};

export default { typeDefs, resolvers };
