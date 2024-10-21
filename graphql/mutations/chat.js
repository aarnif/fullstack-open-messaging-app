import Chat from "../../models/chat.js";
import User from "../../models/user.js";

import helpers from "../../utils/helpers.js";
import pubsub from "../../pubsub.js";

import { GraphQLError } from "graphql";

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
    updateGroupChatParticipants(
      chatId: ID!
      participants: [ID!]!
    ): Chat
    leaveGroupChats(
      chatIds: [ID!]!
    ): [String!]!
  }
  type newGroupChatParticipants {
    updatedChat: Chat
    removedParticipants: [ID]
    addedParticipants: [ID]
  }
  type Subscription {
    chatAdded: Chat!
    messageToChatAdded: Chat!
    chatDeleted: String!
    groupChatUpdated: Chat!
    messagesInChatRead: Chat!
    participantsAddedToGroupChat: Chat!
    participantsRemovedFromGroupChat: Chat!
    groupChatParticipantsUpdated: newGroupChatParticipants
    leftGroupChats: [String!]!
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

      if (chatToBeUpdated.title === "Private chat") {
        const checkIfAnotherUserHasBlockedYou =
          chatToBeUpdated.participants.find((participant) => {
            return (
              participant._id !== context.currentUser.id &&
              participant.blockedContacts.includes(context.currentUser.id)
            );
          });

        if (checkIfAnotherUserHasBlockedYou) {
          throw new GraphQLError(
            `${checkIfAnotherUserHasBlockedYou.name} has blocked you!`,
            {
              extensions: {
                code: "FORBIDDEN",
              },
            }
          );
        }
      }
      const messageIsSingleEmoji = helpers.checkIfMessageIsSingleEmoji(
        args.content.trim()
      );

      const newMessage = {
        type: messageIsSingleEmoji ? "singleEmoji" : args.type,
        sender: context.currentUser.id,
        content: args.content.trim(),
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
          key !== "input" &&
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
        } else if (key === "input" && value !== chatToBeUpdated.image) {
          console.log(`Updated image for chat: ${chatToBeUpdated.title}`);
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
            $set: { ...args, image: args.input },
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
    updateGroupChatParticipants: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const findChat = await Chat.findById(args.chatId);

      const oldParticipants = findChat.participants.map((participant) =>
        participant._id.toString()
      );
      const newParticipants = args.participants;
      const notificationMessages = [];

      try {
        const removedParticipants = [...oldParticipants].filter(
          (participant) => !newParticipants.includes(participant)
        );
        const addedParticipants = [...newParticipants].filter(
          (participant) => !oldParticipants.includes(participant)
        );

        const allParticipantsToFetch = [
          ...removedParticipants,
          ...addedParticipants,
        ];

        const users = await User.find({ _id: { $in: allParticipantsToFetch } });

        const usersToRemove = users.filter((user) =>
          removedParticipants.includes(user._id.toString())
        );
        if (usersToRemove.length > 0) {
          await User.updateMany(
            { _id: { $in: removedParticipants } },
            { $pull: { chats: args.chatId } }
          );

          usersToRemove.forEach((user) => {
            notificationMessages.push({
              type: "notification",
              sender: context.currentUser.id,
              content: `${user.name} was removed`,
            });
          });
        }

        const usersToAdd = users.filter((user) =>
          addedParticipants.includes(user._id.toString())
        );
        if (usersToAdd.length > 0) {
          await User.updateMany(
            { _id: { $in: addedParticipants } },
            { $addToSet: { chats: args.chatId } }
          );

          usersToAdd.forEach((user) => {
            notificationMessages.push({
              type: "notification",
              sender: context.currentUser.id,
              content: `${user.name} joined`,
            });
          });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $set: { participants: args.participants },
            $push: { messages: { $each: notificationMessages, $position: 0 } },
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

        pubsub.publish("GROUP_CHAT_PARTICIPANTS_UPDATED", {
          groupChatParticipantsUpdated: {
            updatedChat: updatedChat,
            removedParticipants:
              usersToRemove.map((user) => user._id.toString()) || [],
            addedParticipants:
              usersToAdd.map((user) => user._id.toString()) || [],
          },
        });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Updating chat participants failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },
    leaveGroupChats: async (root, args, context) => {
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
        const updatedChats = await Chat.updateMany(
          {
            _id: { $in: args.chatIds },
          },
          {
            $push: {
              messages: { $each: [message], $position: 0 },
            },
            $pull: { participants: context.currentUser.id },
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

        const removeChatFromCurrentUser = await User.findByIdAndUpdate(
          context.currentUser.id,
          {
            $pull: { chats: { $in: args.chatIds } },
          },
          { new: true }
        );

        const getUpdatedChats = await Chat.find({
          _id: { $in: args.chatIds },
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
          });

        getUpdatedChats.forEach((chat) => {
          pubsub.publish("MESSAGE_TO_CHAT_ADDED", {
            messageToChatAdded: chat,
          });
        });

        return args.chatIds;
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
    groupChatParticipantsUpdated: {
      subscribe: () => pubsub.asyncIterator("GROUP_CHAT_PARTICIPANTS_UPDATED"),
    },
    leftGroupChats: {
      subscribe: () => pubsub.asyncIterator("LEFT_GROUP_CHATS"),
    },
  },
};

export default { typeDefs, resolvers };
