import Chat from "../../models/chat.js";
import User from "../../models/user.js";

import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const typeDefs = `
  extend type Mutation {
    createChat(
      title: String
      participants: [ID!]!
    ): Chat
  }
  type Subscription {
    chatAdded: Chat!
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

      const addedChat = newChat.populate("participants");

      pubsub.publish("CHAT_ADDED", { chatAdded: addedChat });

      return addedChat;
    },
  },
  Subscription: {
    chatAdded: {
      subscribe: () => pubsub.asyncIterator("CHAT_ADDED"),
    },
  },
};

export default { typeDefs, resolvers };
