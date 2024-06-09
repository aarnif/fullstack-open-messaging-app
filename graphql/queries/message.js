import Message from "../../models/message.js";

const typeDefs = `
  scalar Date
  type Message {
    id: ID!
    sender: User!
    chat: Chat!
    content: String!
    createdAt: Date!
  }

  extend type Query {
    countMessages: Int!
    allMessages: [Message!]!
  }
`;

const resolvers = {
  Query: {
    countMessages: async () => Message.collection.countDocuments(),
    allMessages: async () =>
      Message.find({}).populate("sender").populate("chat"),
  },
};

export default { typeDefs, resolvers };
