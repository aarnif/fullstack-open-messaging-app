import User from "../../models/user.js";

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

  extend type Query {
    countUsers: Int!
    allUsers(name: String): [User!]!
  }
`;

const resolvers = {
  Query: {
    countUsers: async () => User.collection.countDocuments(),
    allUsers: async (root, args) =>
      User.find({
        name: { $regex: `(?i)${args.name}(?-i)` },
      })
        .populate("chats")
        .populate({
          path: "chats",
          populate: { path: "messages" },
        }),
  },
};

export default { typeDefs, resolvers };
