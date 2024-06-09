import Chat from "../../models/chat.js";

const typeDefs = `
  type Chat {
    id: ID!
    title: String
    participants: [User!]!
  }

  extend type Query {
    countChats: Int!
    allChats: [Chat!]!
  }
`;

const resolvers = {
  Query: {
    countChats: async () => Chat.collection.countDocuments(),
    allChats: async () => Chat.find({}).populate("participants"),
  },
};

export default { typeDefs, resolvers };
