import Chat from "../../models/chat.js";

const typeDefs = `
  scalar Date

  type isReadBy {
    member: User
    isRead: Boolean
  }

  type Message {
    id: ID!
    sender: User!
    content: String
    isReadBy: [isReadBy!]!
    createdAt: Date
  }

  type Chat {
    id: ID!
    title: String
    image: String
    description: String
    isGroupChat: Boolean
    participants: [User!]!
    messages: [Message!]!
    latestMessage: Message
    createdAt: Date
  }

  extend type Query {
    countChats: Int!
    allChats: [Chat!]!
    findChatById(chatId: ID!): Chat
    findChatByParticipants(participants: [ID!]!): Chat
    allChatsByUser(userId: ID!, searchByTitle: String): [Chat!]!
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
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        });
      return chats;
    },
    findChatById: async (root, args) =>
      Chat.findById(args.chatId)
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        })
        .catch((error) => {
          throw new GraphQLError("Invalid id!", {
            extensions: {
              code: "INVALID_ID",
              invalidArgs: args.chatId,
              error,
            },
          });
        }),
    findChatByParticipants: async (root, args) =>
      Chat.findOne({ participants: args.participants })
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        }),
    allChatsByUser: async (root, args) =>
      Chat.find({
        participants: { $in: args.userId },
        title: {
          $regex: `(?i)${args.searchByTitle ? args.searchByTitle : ""}(?-i)`,
        },
      })
        .populate("participants")
        .populate({
          path: "messages",
          populate: { path: "sender" },
        })
        .populate({
          path: "messages",
          populate: { path: "isReadBy.member" },
        })
        .sort({ "messages.0.createdAt": "desc" }),
  },
};

export default { typeDefs, resolvers };
