import Chat from "../../models/chat.js";

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
    createChat: async (root, args) => {
      const newChat = new Chat({
        title: args.title,
        participants: args.participants,
      });

      try {
        newChat.save();
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
