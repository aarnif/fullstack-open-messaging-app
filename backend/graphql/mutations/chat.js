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

  input MessageInput {
    type: String
    content: String
    image: ImageInput
  }

  extend type Mutation {
    createChat(
      title: String
      description: String
      memberIds: [ID!]!
      initialMessage: MessageInput!
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
    markChatAsRead(
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
  type UnreadMessageAdded {
    userId: ID!
    chatId: ID!
    messageId: String!
  }

  type Subscription {
    newChatCreated: Chat!
    messageToChatAdded: Chat!
    chatDeleted: String!
    groupChatUpdated: Chat!
    leftGroupChats: leftGroupChatsDetails
    groupChatEdited: groupChatEditedDetails
    unreadMessageAdded: UnreadMessageAdded!
  }   
`;

const determineMessageType = (content, defaultType = "message") => {
  const trimmedContent = content.trim();

  if (checkIfMessageIsSingleEmoji(trimmedContent)) {
    return "singleEmoji";
  } else if (chekcIfMessageIsImageWithoutText(trimmedContent)) {
    return "singleImage";
  }

  return defaultType;
};

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

const chekcIfMessageIsImageWithoutText = (messageContent) => {
  return messageContent === ""; // Currently messages without content are always images
};

const addUnreadMessageForUsers = async (userIds, chatId, messageId) => {
  try {
    for (const userId of userIds) {
      const user = await User.findById(userId);

      const existingChatIndex = user.unreadMessages.findIndex(
        (chat) => chat.chatId.toString() === chatId.toString()
      );

      if (existingChatIndex !== -1) {
        await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              [`unreadMessages.${existingChatIndex}.messages`]: { messageId },
            },
          },
          { new: true }
        );
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $push: { unreadMessages: { chatId, messages: [{ messageId }] } } },
          { new: true }
        );
      }

      pubsub.publish("UNREAD_MESSAGE_ADDED", {
        unreadMessageAdded: {
          userId: userId.toString(),
          chatId: chatId.toString(),
          messageId,
        },
      });
    }
  } catch (error) {
    console.error("Error adding unread message for users:", error);
    throw error;
  }
};

const markChatAsReadForUser = async (userId, chatId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { unreadMessages: { chatId: chatId } } },
      { new: true }
    );
  } catch (error) {
    console.error("Error marking chat as read:", error);
    throw error;
  }
};

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

      if (args.memberIds.length < 2) {
        throw new GraphQLError("At least two members are required", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }

      const isGroupChat = args.memberIds.length > 2;
      let chatTitle = args.title;
      let chatImage = args.input;

      if (!isGroupChat) {
        const otherMemberId = args.memberIds.find(
          (id) => id !== context.currentUser.id
        );
        const otherMember = await User.findById(otherMemberId);

        if (!otherMember) {
          throw new GraphQLError("One or more members not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        chatTitle = otherMember.name;
        chatImage = otherMember.image;
      } else if (!args.title) {
        throw new GraphQLError("Group chats require a title", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const trimmedContent = args.initialMessage.content.trim();
      const messageType = determineMessageType(
        args.initialMessage.content,
        args.initialMessage.type || "message"
      );

      const initialMessageContent = {
        type: messageType,
        sender: context.currentUser.id,
        content: trimmedContent,
        image: args.initialMessage.image,
        isReadBy: args.memberIds.map((memberId) => ({
          member: memberId,
          isRead: context.currentUser.id === memberId,
        })),
      };

      const newChat = new Chat({
        title: chatTitle,
        image: chatImage,
        description: args.description || "",
        isGroupChat,
        admin: context.currentUser.id,
        members: args.memberIds,
        messages: [initialMessageContent],
      });

      try {
        await newChat.save();

        await User.updateMany(
          { _id: { $in: args.memberIds } },
          { $push: { chats: newChat._id } }
        );

        const memberIdsExcludingSender = args.memberIds.filter(
          (id) => id !== context.currentUser.id
        );

        const messageId = newChat.messages[0]._id.toString();
        await addUnreadMessageForUsers(
          memberIdsExcludingSender,
          newChat._id,
          messageId
        );

        const createdChat = await Chat.findById(newChat._id)
          .populate("admin")
          .populate("members")
          .populate({
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        pubsub.publish("NEW_CHAT_CREATED", { newChatCreated: createdChat });

        return createdChat;
      } catch (error) {
        throw new GraphQLError("Failed to create chat", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
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
        .populate("members")
        .populate({
          path: "members",
          populate: { path: "blockedContacts" },
        });

      if (!chatToBeUpdated) {
        throw new GraphQLError("Chat not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.chatId,
          },
        });
      }

      if (!chatToBeUpdated.isGroupChat) {
        const checkIfAnotherUserHasBlockedYou = chatToBeUpdated.members.find(
          (member) =>
            member.username !== context.currentUser.username &&
            member.blockedContacts.some(
              (contact) => contact.username === context.currentUser.username
            )
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

      const trimmedContent = args.content.trim();
      const messageType = determineMessageType(args.content);

      const newMessage = {
        type: messageType,
        sender: context.currentUser.id,
        content: trimmedContent,
        image: args.input,
        isReadBy: chatToBeUpdated.members.map((member) => ({
          member: member._id,
          isRead: context.currentUser._id.equals(member._id),
        })),
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
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        const memberIdsExcludingSender = chatToBeUpdated.members
          .filter((member) => !member._id.equals(context.currentUser.id))
          .map((member) => member._id);

        const addedMessage = updatedChat.messages[0];
        const messageId = addedMessage._id.toString();
        await addUnreadMessageForUsers(
          memberIdsExcludingSender,
          args.chatId,
          messageId
        );

        pubsub.publish("MESSAGE_TO_CHAT_ADDED", {
          messageToChatAdded: updatedChat,
        });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Failed to add message to chat", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
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

      if (
        chatToBeDeleted.isGroupChat &&
        !chatToBeDeleted.admin.equals(context.currentUser.id)
      ) {
        throw new GraphQLError("Not authorized to delete this chat", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      try {
        const removeChat = await Chat.findByIdAndDelete(args.chatId);

        await User.updateMany(
          { _id: { $in: chatToBeDeleted.members.map((member) => member._id) } },
          {
            $pull: {
              chats: args.chatId,
              unreadMessages: { chatId: args.chatId },
            },
          }
        );

        pubsub.publish("CHAT_DELETED", {
          chatDeleted: removeChat.id,
        });

        return removeChat.id;
      } catch (error) {
        throw new GraphQLError("Failed to delete chat", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
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

      if (!args.title || !args.title.trim().length) {
        throw new GraphQLError("Group chat title cannot be empty", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { title: args.title },
          },
        });
      }

      if (!chatToBeUpdated.admin.equals(context.currentUser.id)) {
        throw new GraphQLError("Not authorized to edit this chat", {
          extensions: { code: "FORBIDDEN" },
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
            content: `Chat ${key} was updated`,
          });
        } else if (
          key === "input" &&
          JSON.stringify(value) !== JSON.stringify(chatToBeUpdated.image)
        ) {
          console.log(`Updated image for chat: ${chatToBeUpdated.title}`);
          notificationMessages.push({
            type: "notification",
            sender: context.currentUser.id,
            content: "Chat image was updated",
          });
        } else if (key === "memberIds") {
          const oldMembersIds = chatToBeUpdated.members.map((member) =>
            member._id.toString()
          );
          const removedMemberIds = oldMembersIds.filter(
            (id) => !args.memberIds.includes(id)
          );

          const addedMemberIds = args.memberIds.filter(
            (id) => !oldMembersIds.includes(id)
          );

          if (removedMemberIds.length > 0) {
            const removedUsers = await User.find({
              _id: { $in: removedMemberIds },
            });

            await User.updateMany(
              { _id: { $in: removedMemberIds } },
              {
                $pull: {
                  chats: args.chatId,
                  unreadMessages: { chatId: args.chatId },
                },
              }
            );

            removedUsers.forEach((user) => {
              notificationMessages.push({
                type: "notification",
                sender: context.currentUser.id,
                content: `${user.name} was removed`,
              });
            });

            groupChatEditedDetails.removedMemberIds = removedMemberIds;
          }

          if (addedMemberIds.length > 0) {
            const addedUsers = await User.find({
              _id: { $in: addedMemberIds },
            });

            await User.updateMany(
              { _id: { $in: addedMemberIds } },
              { $addToSet: { chats: args.chatId } }
            );

            addedUsers.forEach((user) => {
              notificationMessages.push({
                type: "notification",
                sender: context.currentUser.id,
                content: `${user.name} joined`,
              });
            });

            groupChatEditedDetails.addedMemberIds = addedMemberIds;
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
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
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
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Marking messages as read failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },

    markChatAsRead: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      try {
        await markChatAsReadForUser(context.currentUser.id, args.chatId);

        const updatedChat = await Chat.findById(args.chatId)
          .populate("admin")
          .populate("members")
          .populate({
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        if (!updatedChat) {
          throw new GraphQLError("Chat not found!", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.chatId,
            },
          });
        }

        return updatedChat;
      } catch (error) {
        throw new GraphQLError("Marking chat as read failed", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
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

      const exitMessage = {
        type: "notification",
        sender: context.currentUser.id,
        content: `${context.currentUser.name} left`,
      };

      try {
        await Chat.updateMany(
          { _id: { $in: args.chatIds } },
          {
            $push: { messages: { $each: [exitMessage], $position: 0 } },
            $pull: { members: context.currentUser.id },
          }
        );

        await User.findByIdAndUpdate(context.currentUser.id, {
          $pull: {
            chats: { $in: args.chatIds },
            unreadMessages: { chatId: { $in: args.chatIds } },
          },
        });

        const updatedChats = await Chat.find({ _id: { $in: args.chatIds } })
          .populate("admin")
          .populate("members")
          .populate({
            path: "members",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "sender" },
          })
          .populate({
            path: "messages.sender",
            populate: { path: "blockedContacts" },
          })
          .populate({
            path: "messages",
            populate: { path: "isReadBy.member" },
          });

        updatedChats.forEach((chat) => {
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
        throw new GraphQLError("Failed to leave group chats", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
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
    leftGroupChats: {
      subscribe: () => pubsub.asyncIterator("LEFT_GROUP_CHATS"),
    },
    groupChatEdited: {
      subscribe: () => pubsub.asyncIterator("GROUP_CHAT_EDITED"),
    },
    unreadMessageAdded: {
      subscribe: () => pubsub.asyncIterator("UNREAD_MESSAGE_ADDED"),
    },
  },
};

export default { typeDefs, resolvers };
