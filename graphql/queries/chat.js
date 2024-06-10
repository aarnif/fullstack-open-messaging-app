import Chat from "../../models/chat.js";

const typeDefs = `
  type Chat {
    id: ID!
    title: String
    participants: [User!]!
    messages: [Message!]!
  }

  extend type Query {
    countChats: Int!
    allChats: [Chat!]!
  }
`;

const resolvers = {
  Query: {
    countChats: async () => Chat.collection.countDocuments(),
    allChats: async () => {
      const chats = await Chat.find({})
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        });
      return chats;
    },
  },
};

export default { typeDefs, resolvers };
