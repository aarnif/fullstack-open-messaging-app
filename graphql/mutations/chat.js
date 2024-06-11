import Chat from "../../models/chat.js";
import User from "../../models/user.js";

const typeDefs = `
  extend type Mutation {
    createChat(
      title: String
      participants: [ID!]!
    ): Chat
  }
`;

const resolvers = {
  Mutation: {
    createChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const newChat = new Chat({
        title: args.title,
        participants: args.participants,
      });

      try {
        newChat.save();
        const addChatToParticipatingUsersChats = args.participants.map(
          async (participant) => {
            await User.findByIdAndUpdate(participant, {
              $push: { chats: newChat._id },
            });
          }
        );
      } catch (error) {
        throw new GraphQLError("Creating chat failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
      return newChat.populate("participants");
    },
  },
};

export default { typeDefs, resolvers };
