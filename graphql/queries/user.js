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
    chats: [Chat!]!
  }

  type Token {
    value: String!
  }

  extend type Query {
    countUsers: Int!
    allUsers(name: String): [User!]!
    findUserById(id: ID!): User
    me: User
  }
`;

const resolvers = {
  Query: {
    countUsers: async () => User.collection.countDocuments(),
    allUsers: async (root, args) =>
      User.find({
        name: { $regex: `(?i)${args.name ? args.name : ""}(?-i)` },
      })
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
    me: async (root, args, context) => context.currentUser,
  },
};

export default { typeDefs, resolvers };
