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
    findChatById(id: ID!): Chat
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
    findChatById: async (root, args) =>
      Chat.findById(args.id)
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
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
  },
};

export default { typeDefs, resolvers };
