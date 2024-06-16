import e from "cors";
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
      let chatTitle = "";
      const userInputError = new GraphQLError({
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args,
        },
      });

      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      } else if (args.participants.length < 2) {
        userInputError.message = "At least two participants are required!";
        throw userInputError;
      } else if (args.participants.length === 2) {
        const anotherParticipantId = args.participants.find(
          (participant) => participant !== context.currentUser.id
        );
        const findAnotherUser = await User.findById(anotherParticipantId);
        chatTitle = findAnotherUser.name;
      } else if (args.participants.length > 2 && !args.title) {
        userInputError.message = "Chat title is required for group chats!";
        throw userInputError;
      } else {
        chatTitle = args.title;
      }

      const checkIfChatExists = await Chat.findOne({
        title: chatTitle,
      });

      if (checkIfChatExists) {
        userInputError.message = "Chat already exists!";
        throw userInputError;
      }

      const newChat = new Chat({
        title: chatTitle,
        participants: args.participants,
        latestMessage: {
          sender: context.currentUser._id,
          content: "Chat created",
        },
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
            code: "INTERNAL_SERVER_ERROR",
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
