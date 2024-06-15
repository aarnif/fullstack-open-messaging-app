import Chat from "../../models/chat.js";

const typeDefs = `
  type Chat {
    id: ID!
    title: String
    image: String
    participants: [User!]!
    messages: [Message!]!
  }

  extend type Query {
    countChats: Int!
    allChats: [Chat!]!
    findChatById(id: ID!): Chat
    allChatsByUser(userId: ID!): [Chat!]!
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
    allChatsByUser: async (root, args) => {
      const allUsersChats = await Chat.find({
        participants: { $in: args.userId },
      })
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        });

      return allUsersChats.sort((a, b) => {
        const latestMessagesA = a.messages[a.messages.length - 1];
        const latestMessageB = b.messages[b.messages.length - 1];
        return latestMessageB?.createdAt - latestMessagesA?.createdAt;
      });
    },
  },
};

export default { typeDefs, resolvers };
