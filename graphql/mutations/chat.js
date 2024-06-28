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
    addMessageToChat(
      chatId: ID!
      content: String!
    ): Chat
    deleteChat(
      chatId: ID!
    ): String!
    markAllMessagesInChatRead(
      chatId: ID!
    ): Chat
    leaveGroupChat(
      chatId: ID!
    ): String!
  }
  type Subscription {
    chatAdded: Chat!
    messageToChatAdded: Chat!
    chatDeleted: String!
    messagesInChatRead: Chat!
    leftGroupChat: String!
  }   
`;

const resolvers = {
  Mutation: {
    createChat: async (root, args, context) => {
      let chatTitle = "";
      let chatImage = "chat_placeholder.png";
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
        chatImage = findAnotherUser.profilePicture;
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
        image: chatImage,
        participants: args.participants,
        latestMessage: {
          sender: context.currentUser._id,
          content: "Chat created",
        },
      });

      console.log("newChat", newChat);

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
    addMessageToChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const chatToBeUpdated = await Chat.findById(args.chatId).populate(
        "participants"
      );

      const newMessage = {
        sender: context.currentUser.id,
        content: args.content,
        isReadBy: chatToBeUpdated.participants.map((participant) => {
          return context.currentUser._id.equals(participant._id)
            ? { member: participant._id, isRead: true }
            : { member: participant._id, isRead: false };
        }),
      };

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $push: { messages: { $each: [newMessage], $position: 0 } },
          },
          { new: true }
        )
          .populate("participants")
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });
        pubsub.publish("MESSAGE_TO_CHAT_ADDED", {
          messageToChatAdded: updatedChat,
        });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Adding message to chat failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    deleteChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const chatToBeDeleted = await Chat.findById(args.chatId).populate(
        "participants"
      );

      if (!chatToBeDeleted) {
        throw new GraphQLError("Chat not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.chatId,
          },
        });
      }

      try {
        const removeChat = await Chat.findByIdAndDelete(args.chatId);
        console.log("removeChat", removeChat);
        const removeChatFromParticipatingUsersChats =
          chatToBeDeleted.participants.map(async (participant) => {
            const user = await User.findByIdAndUpdate(participant, {
              $pull: { chats: args.chatId },
            });
          });
        pubsub.publish("CHAT_DELETED", { chatDeleted: removeChat.id });
        return removeChat.id;
      } catch (error) {
        throw new GraphQLError("Removing chat failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    markAllMessagesInChatRead: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $set: {
              "messages.$[messageElem].isReadBy.$[readElem].isRead": true,
            },
          },
          {
            arrayFilters: [
              { "messageElem.isReadBy": { $exists: true } },
              { "readElem.member": context.currentUser.id },
            ],
            new: true,
          }
        )
          .populate("participants")
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        pubsub.publish("MESSAGES_IN_CHAT_READ", {
          messagesInChatRead: updatedChat,
        });
        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Marking messages as read failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    leaveGroupChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $pull: { participants: context.currentUser.id },
          },
          { new: true }
        )
          .populate("participants")
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        const removeChatFromParticipant = await User.findByIdAndUpdate(
          context.currentUser.id,
          {
            $pull: { chats: args.chatId },
          }
        );

        pubsub.publish("LEFT_GROUP_CHAT", {
          leftGroupChat: updatedChat.id,
        });

        return updatedChat.id;
      } catch (error) {
        throw new GraphQLError("Removing chat participant failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args,
            error,
          },
        });
      }
    },
  },

  Subscription: {
    chatAdded: {
      subscribe: () => pubsub.asyncIterator("CHAT_ADDED"),
    },
    messageToChatAdded: {
      subscribe: () => pubsub.asyncIterator("MESSAGE_TO_CHAT_ADDED"),
    },
    chatDeleted: {
      subscribe: () => pubsub.asyncIterator("CHAT_DELETED"),
    },
    messagesInChatRead: {
      subscribe: () => pubsub.asyncIterator("MESSAGES_IN_CHAT_READ"),
    },
    leftGroupChat: {
      subscribe: () => pubsub.asyncIterator("LEFT_GROUP_CHAT"),
    },
  },
};

export default { typeDefs, resolvers };
