import Chat from "../../models/chat.js";

const typeDefs = `
  scalar Date

  type IsReadBy {
    member: User
    isRead: Boolean
  }

  type Image {
    thumbnail: String
    original: String
  }

  type Message {
    id: ID!
    type: String
    sender: User!
    content: String
    image: Image
    isReadBy: [IsReadBy!]!
    createdAt: Date
  }

  type Chat {
    id: ID!
    title: String
    image: Image
    description: String
    isGroupChat: Boolean
    admin: User
    participants: [User!]!
    messages: [Message!]!
    latestMessage: Message
    createdAt: Date
    displayChatTitle: String!
    displayChatImage: Image
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
        .populate("admin")
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
        .populate("admin")
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
        .populate("admin")
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
        .populate("admin")
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
  Chat: {
    displayChatTitle: (chat, args, context) =>
      chat.displayChatTitle(context.currentUser.id),
    displayChatImage: (chat, args, context) =>
      chat.displayChatImage(context.currentUser.id),
  },
};

export default { typeDefs, resolvers };
