import Chat from "../../models/chat.js";
import User from "../../models/user.js";

import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const typeDefs = `
  input ImageInput {
    thumbnail: String
    original: String
  }

  extend type Mutation {
    createChat(
      title: String
      description: String
      participants: [ID!]!
    ): Chat
    addMessageToChat(
      chatId: ID!
      type: String
      content: String
      input: ImageInput
    ): Chat
    deleteChat(
      chatId: ID!
    ): String!
    updateGroupChat(
      chatId: ID!
      title: String
      description: String
      input: ImageInput
    ): Chat
    markAllMessagesInChatRead(
      chatId: ID!
    ): Chat
    addParticipantsToGroupChat(
      chatId: ID!
      participants: [ID!]!
    ): Chat
    removeParticipantsFromGroupChat(
      chatId: ID!
      participants: [ID!]!
    ): Chat
    leaveGroupChat(
      chatId: ID!
    ): String!
  }
  type Subscription {
    chatAdded: Chat!
    messageToChatAdded: Chat!
    chatDeleted: String!
    groupChatUpdated: Chat!
    messagesInChatRead: Chat!
    participantsAddedToGroupChat: Chat!
    participantsRemovedFromGroupChat: Chat!
    leftGroupChat: String!
  }   
`;

const resolvers = {
  Mutation: {
    createChat: async (root, args, context) => {
      let chatTitle = null;
      let isGroupChat = false;
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
        console.log("Creating private chat with two participants");
        chatTitle = "Private chat";
      } else if (args.participants.length > 2 && !args.title) {
        userInputError.message = "Chat title is required for group chats!";
        throw userInputError;
      } else {
        console.log("Creating group chat");
        chatTitle = args.title;
        isGroupChat = true;
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
        image: args.input,
        description: args.description,
        isGroupChat: isGroupChat,
        admin: context.currentUser,
        participants: args.participants,
        latestMessage: {
          sender: context.currentUser,
          content: "Chat created",
        },
      });

      console.log("newChat", newChat);

      try {
        newChat.save();
        const addChatToParticipatingUsersChats = args.participants.map(
          async (participant) => {
            await User.findByIdAndUpdate(participant, {
              $push: { chats: newChat },
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

      const chatToBeUpdated = await Chat.findById(args.chatId)
        .populate("admin")
        .populate("participants");

      const newMessage = {
        type: args.type,
        sender: context.currentUser.id,
        content: args.content,
        image: args.input,
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

    updateGroupChat: async (root, args, context) => {
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

      if (!chatToBeUpdated) {
        throw new GraphQLError("Chat not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.chatId,
          },
        });
      }

      const notificationMessages = [];

      for (const [key, value] of Object.entries(args)) {
        if (
          key !== "chatId" &&
          key !== "image" &&
          value !== chatToBeUpdated[key]
        ) {
          console.log(`${key} was updated to: "${value}"`);
          notificationMessages.push({
            type: "notification",
            sender: context.currentUser.id,
            content: `${
              key[0].toUpperCase() + key.slice(1)
            } was updated to: "${value}"`,
          });
        } else if (key === "image" && value !== chatToBeUpdated.image) {
          console.log("Image was updated");
          notificationMessages.push({
            type: "notification",
            sender: context.currentUser.id,
            content: "Image was updated",
          });
        }
      }

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $set: args,
            $push: {
              messages: { $each: notificationMessages, $position: 0 },
            },
          },
          { new: true }
        )
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

        pubsub.publish("GROUP_CHAT_UPDATED", { groupChatUpdated: updatedChat });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Updating chat failed", {
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

    addParticipantsToGroupChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const newParticipants = await User.find({
        _id: { $in: args.participants },
      });

      const notificationMessages = [];

      newParticipants.forEach((participant) => {
        notificationMessages.push({
          type: "notification",
          sender: context.currentUser.id,
          content: `${participant.name} joined`,
        });
      });

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $push: {
              participants: { $each: args.participants },
              messages: { $each: notificationMessages, $position: 0 },
            },
          },
          { new: true }
        )
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

        const addChatToNewParticipants = await User.updateMany(
          { _id: { $in: args.participants } },
          {
            $push: { chats: args.chatId },
          }
        );

        pubsub.publish("PARTICIPANTS_ADDED_TO_GROUP_CHAT", {
          participantsAddedToGroupChat: updatedChat,
        });

        pubsub.publish("MESSAGE_TO_CHAT_ADDED", {
          messageToChatAdded: updatedChat,
        });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Adding chat participants failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    removeParticipantsFromGroupChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const newParticipants = await User.find({
        _id: { $in: args.participants },
      });

      const notificationMessages = [];

      newParticipants.forEach((participant) => {
        notificationMessages.push({
          type: "notification",
          sender: context.currentUser.id,
          content: `${participant.name} was removed`,
        });
      });

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $pull: {
              participants: { $in: args.participants },
            },
            $push: {
              messages: { $each: notificationMessages, $position: 0 },
            },
          },
          { new: true }
        )
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

        const removeChatFromRemovedParticipants = await User.updateMany(
          { _id: { $in: args.participants } },
          {
            $pull: { chats: args.chatId },
          }
        );

        pubsub.publish("PARTICIPANTS_REMOVED_FROM_GROUP_CHAT", {
          participantsRemovedFromGroupChat: updatedChat,
        });

        pubsub.publish("MESSAGE_TO_CHAT_ADDED", {
          messageToChatAdded: updatedChat,
        });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Removing chat participants failed", {
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

      const message = {
        type: "notification",
        sender: context.currentUser.id,
        content: `${context.currentUser.name} left`,
      };

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $pull: { participants: context.currentUser.id },
          },
          {
            $push: {
              messages: { $each: [message], $position: 0 },
            },
          },

          { new: true }
        )
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
    groupChatUpdated: {
      subscribe: () => pubsub.asyncIterator("GROUP_CHAT_UPDATED"),
    },
    messagesInChatRead: {
      subscribe: () => pubsub.asyncIterator("MESSAGES_IN_CHAT_READ"),
    },
    participantsAddedToGroupChat: {
      subscribe: () => pubsub.asyncIterator("PARTICIPANTS_ADDED_TO_GROUP_CHAT"),
    },
    participantsRemovedFromGroupChat: {
      subscribe: () =>
        pubsub.asyncIterator("PARTICIPANTS_REMOVED_FROM_GROUP_CHAT"),
    },
    leftGroupChat: {
      subscribe: () => pubsub.asyncIterator("LEFT_GROUP_CHAT"),
    },
  },
};

export default { typeDefs, resolvers };
