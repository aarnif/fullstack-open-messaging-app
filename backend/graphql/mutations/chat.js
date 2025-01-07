import { GraphQLError } from "graphql";
import emojiRegex from "emoji-regex";

import Chat from "../../models/chat.js";
import User from "../../models/user.js";

import pubsub from "../../pubsub.js";

const typeDefs = `
  input ImageInput {
    thumbnail: String
    original: String
  }

  extend type Mutation {
    createChat(
      title: String
      description: String
      memberIds: [ID!]!
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
    editGroupChat(
      chatId: ID!
      title: String
      description: String
      input: ImageInput
      memberIds: [ID!]!
    ): Chat
    markAllMessagesInChatRead(
      chatId: ID!
    ): Chat
    leaveGroupChats(
      chatIds: [ID!]!
    ): [String!]!
  }
  type groupChatEditedDetails {
    updatedChat: Chat
    removedMemberIds: [ID]
    addedMemberIds: [ID]
  }
  type leftGroupChatsDetails {
    memberId: ID
    chatIds: [ID]
  }
  type Subscription {
    newChatCreated: Chat!
    messageToChatAdded: Chat!
    chatDeleted: String!
    groupChatUpdated: Chat!
    messagesInChatRead: Chat!
    leftGroupChats: leftGroupChatsDetails
    groupChatEdited: groupChatEditedDetails
  }   
`;

const checkIfMessageIsSingleEmoji = (messageContent) => {
  const regex = emojiRegex();
  let numberOfEmojis = 0;
  let numberofEmojiCharacters = 0;
  for (const match of messageContent.matchAll(regex)) {
    const emoji = match[0];
    numberOfEmojis += 1;
    numberofEmojiCharacters += emoji.length;
  }

  return (
    numberofEmojiCharacters === messageContent.length && numberOfEmojis === 1
  );
};

const resolvers = {
  Mutation: {
    createChat: async (root, args, context) => {
      let chatTitle = args.title;
      let chatImage = args.input;
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
      } else if (args.memberIds.length < 2) {
        userInputError.message = "At least two members are required!";
        throw userInputError;
      } else if (args.memberIds.length === 2) {
        console.log("Creating private chat with two members");
        const findTheOtherChatMember = args.memberIds.find(
          (member) => member !== context.currentUser.id
        );
        const theOtherChatMember = await User.findById(findTheOtherChatMember);
        chatTitle = theOtherChatMember.name;
        chatImage = theOtherChatMember.image;
      } else if (args.memberIds.length > 2 && !args.title) {
        userInputError.message = "Chat title is required for group chats!";
        throw userInputError;
      } else {
        console.log("Creating group chat");
        isGroupChat = true;
      }

      const newChat = new Chat({
        title: chatTitle,
        image: chatImage,
        description: args.description,
        isGroupChat: isGroupChat,
        admin: context.currentUser,
        members: args.memberIds,
      });

      try {
        newChat.save();
        const addChatToParticipatingUsersChats = args.memberIds.map(
          async (memberId) => {
            await User.findByIdAndUpdate(memberId, {
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

      const createdChat = await newChat.populate("members");

      pubsub.publish("NEW_CHAT_CREATED", { newChatCreated: createdChat });

      return createdChat;
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
        .populate("members");

      if (!chatToBeUpdated) {
        throw new GraphQLError("Chat not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.chatId,
          },
        });
      }

      if (chatToBeUpdated.title === "Private chat") {
        const checkIfAnotherUserHasBlockedYou = chatToBeUpdated.members.find(
          (member) => {
            return (
              member._id !== context.currentUser.id &&
              member.blockedContacts.includes(context.currentUser.id)
            );
          }
        );

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
      const messageIsSingleEmoji = checkIfMessageIsSingleEmoji(
        args.content.trim()
      );

      const newMessage = {
        type: messageIsSingleEmoji ? "singleEmoji" : args.type,
        sender: context.currentUser.id,
        content: args.content.trim(),
        image: args.input,
        isReadBy: chatToBeUpdated.members.map((member) => {
          return context.currentUser._id.equals(member._id)
            ? { member: member._id, isRead: true }
            : { member: member._id, isRead: false };
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
          .populate("members")
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
        "members"
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
          chatToBeDeleted.members.map(async (member) => {
            const user = await User.findByIdAndUpdate(member, {
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

    editGroupChat: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const chatToBeUpdated = await Chat.findById(args.chatId).populate(
        "members"
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

      const groupChatEditedDetails = {
        updatedChat: null,
        removedMemberIds: [],
        addedMemberIds: [],
      };

      for (const [key, value] of Object.entries(args)) {
        if (
          key !== "chatId" &&
          key !== "input" &&
          key !== "memberIds" &&
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
        } else if (
          key === "input" &&
          JSON.stringify(value) !== JSON.stringify(chatToBeUpdated.image)
        ) {
          console.log(`Updated image for chat: ${chatToBeUpdated.title}`);
          notificationMessages.push({
            type: "notification",
            sender: context.currentUser.id,
            content: "Image was updated",
          });
        } else if (key === "memberIds") {
          const oldMembers = chatToBeUpdated.members.map((member) =>
            member._id.toString()
          );
          const newMembers = args.memberIds;

          const removedMembers = [...oldMembers].filter(
            (member) => !newMembers.includes(member)
          );
          const addedMembers = [...newMembers].filter(
            (member) => !oldMembers.includes(member)
          );

          const allMembersToFetch = [...removedMembers, ...addedMembers];

          const users = await User.find({ _id: { $in: allMembersToFetch } });

          const usersToRemove = users.filter((user) =>
            removedMembers.includes(user._id.toString())
          );
          if (usersToRemove.length > 0) {
            await User.updateMany(
              { _id: { $in: removedMembers } },
              { $pull: { chats: args.chatId } }
            );

            usersToRemove.forEach((user) => {
              notificationMessages.push({
                type: "notification",
                sender: context.currentUser.id,
                content: `${user.name} was removed`,
              });
            });

            groupChatEditedDetails.removedMemberIds = usersToRemove.map(
              (user) => user._id.toString()
            );
          }

          const usersToAdd = users.filter((user) =>
            addedMembers.includes(user._id.toString())
          );
          if (usersToAdd.length > 0) {
            await User.updateMany(
              { _id: { $in: addedMembers } },
              { $addToSet: { chats: args.chatId } }
            );

            usersToAdd.forEach((user) => {
              notificationMessages.push({
                type: "notification",
                sender: context.currentUser.id,
                content: `${user.name} joined`,
              });
            });

            groupChatEditedDetails.addedMemberIds = usersToAdd.map((user) =>
              user._id.toString()
            );
          }
        }
      }

      try {
        const updatedChat = await Chat.findByIdAndUpdate(
          args.chatId,
          {
            $set: { ...args, image: args.input, members: args.memberIds },
            $push: {
              messages: { $each: notificationMessages, $position: 0 },
            },
          },
          { new: true }
        )
          .populate("admin")
          .populate("members")
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        groupChatEditedDetails.updatedChat = updatedChat;

        pubsub.publish("GROUP_CHAT_EDITED", {
          groupChatEdited: {
            ...groupChatEditedDetails,
          },
        });

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
          .populate("members")
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
            $pull: { members: context.currentUser.id },
          },
          { new: true }
        )
          .populate("admin")
          .populate("members")
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
          .populate("members")
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

        pubsub.publish("LEFT_GROUP_CHATS", {
          leftGroupChats: {
            memberId: context.currentUser.id,
            chatIds: args.chatIds,
          },
        });

        return args.chatIds;
      } catch (error) {
        throw new GraphQLError("Removing chat members failed", {
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
    newChatCreated: {
      subscribe: () => pubsub.asyncIterator("NEW_CHAT_CREATED"),
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
    leftGroupChats: {
      subscribe: () => pubsub.asyncIterator("LEFT_GROUP_CHATS"),
    },
    groupChatEdited: {
      subscribe: () => pubsub.asyncIterator("GROUP_CHAT_EDITED"),
    },
  },
};

export default { typeDefs, resolvers };
