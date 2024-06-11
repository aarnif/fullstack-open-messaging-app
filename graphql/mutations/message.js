import User from "../../models/user.js";
import Chat from "../../models/chat.js";
import Message from "../../models/message.js";

import { GraphQLError } from "graphql";

const typeDefs = `
  extend type Mutation {
    createMessage(
      sender: ID!
      chat: ID!
      content: String!
    ): Message
  }
`;

const resolvers = {
  Mutation: {
    createMessage: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      if (args.content.length < 1) {
        throw new GraphQLError("Message must be at least 1 character long", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.content,
          },
        });
      }

      const newMessage = new Message({
        sender: args.sender,
        chat: args.chat,
        content: args.content,
      });

      try {
        newMessage.save();
        const addMessageToChat = await Chat.findByIdAndUpdate(
          args.chat,
          {
            $push: { messages: newMessage },
          },
          { new: true }
        );
      } catch (error) {
        throw new GraphQLError("Creating message failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.content,
            error,
          },
        });
      }
      return Message.findById(newMessage.id)
        .populate("sender")
        .populate("chat");
    },
  },
};

export default { typeDefs, resolvers };
