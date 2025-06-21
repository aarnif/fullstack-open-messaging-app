import User from "../../models/user.js";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";

const typeDefs = `
  scalar Date

  type Settings {
    theme: String
    time: String
  }

  type UserChatDetails {
    id: ID!
    title: String!
    image: Image
    isGroupChat: Boolean!
    messages: [Message!]!
  }

  type UserChat {
    chat: UserChatDetails!
    unreadMessages: Int!
    lastReadMessageId: ID
    lastReadAt: Date
  }

  type User {
    id: ID!
    username: String!
    name: String
    about: String
    image: Image
    status: String!
    settings: Settings
    createdAt: Date!
    contacts: [User!]!
    blockedContacts: [User!]!
    chats: [UserChat!]!
  }

  type Token {
    value: String!
  }

  extend type Query {
    findUserById(id: ID!): User
    everyChatByUser(searchByTitle: String): [UserChat!]!
    allContactsByUser(searchByName: String): User!
    allContactsExceptByUser(searchByName: String): [User!]!
    checkIfUserHasBlockedYou(userId: ID!): Boolean
    me: User
  }
`;

const resolvers = {
  Query: {
    findUserById: async (root, args) =>
      User.findById(args.id)
        .populate("chats")
        .populate({
          path: "chats",
          populate: { path: "messages" },
        })
        .populate("blockedContacts")
        .catch((error) => {
          throw new GraphQLError("Invalid id!", {
            extensions: {
              code: "INVALID_ID",
              invalidArgs: args.id,
              error,
            },
          });
        }),
    everyChatByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      return User.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId.createFromHexString(
              context.currentUser.id
            ),
          },
        },
        { $unwind: "$chats" },
        {
          $lookup: {
            from: "chats",
            localField: "chats.chat",
            foreignField: "_id",
            as: "chat",
          },
        },
        { $unwind: "$chat" },
        {
          $match: {
            "chat.title": {
              $regex: args.searchByTitle
                ? new RegExp(args.searchByTitle, "i")
                : /.*/,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "chat.members",
            foreignField: "_id",
            as: "chat.members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "chat.admin",
            foreignField: "_id",
            as: "chat.admin",
          },
        },
        {
          $unwind: "$chat.admin",
        },
        {
          $lookup: {
            from: "users",
            localField: "chat.messages.sender",
            foreignField: "_id",
            as: "messageSenders",
          },
        },
        {
          $addFields: {
            latestMessageTime: {
              $arrayElemAt: ["$chat.messages.createdAt", -1],
            },
            "chat.messages": {
              $map: {
                input: "$chat.messages",
                as: "message",
                in: {
                  $mergeObjects: [
                    "$$message",
                    {
                      sender: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$messageSenders",
                              cond: { $eq: ["$$this._id", "$$message.sender"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: {
            latestMessageTime: -1,
          },
        },
        {
          $project: {
            chat: {
              id: "$chat._id",
              title: "$chat.title",
              description: "$chat.description",
              isGroupChat: "$chat.isGroupChat",
              image: "$chat.image",
              admin: {
                id: "$chat.admin._id",
                username: "$chat.admin.username",
                name: "$chat.admin.name",
                image: "$chat.admin.image",
                status: "$chat.admin.status",
              },
              members: {
                $map: {
                  input: "$chat.members",
                  as: "member",
                  in: {
                    id: "$$member._id",
                    username: "$$member.username",
                    name: "$$member.name",
                    image: "$$member.image",
                    status: "$$member.status",
                  },
                },
              },
              messages: {
                $map: {
                  input: "$chat.messages",
                  as: "message",
                  in: {
                    id: "$$message._id",
                    type: "$$message.type",
                    sender: {
                      id: "$$message.sender._id",
                      username: "$$message.sender.username",
                      name: "$$message.sender.name",
                      image: "$$message.sender.image",
                      status: "$$message.sender.status",
                    },
                    content: "$$message.content",
                    image: "$$message.image",
                    createdAt: "$$message.createdAt",
                  },
                },
              },
              createdAt: "$chat.createdAt",
            },
            unreadMessages: "$chats.unreadMessages",
            lastReadMessageId: "$chats.lastReadMessageId",
            lastReadAt: "$chats.lastReadAt",
          },
        },
      ]);
    },
    allContactsByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const searchRegex = args.searchByName || "";

      return User.findById(context.currentUser)
        .populate({
          path: "contacts",
          match: {
            $or: [
              { name: { $regex: searchRegex, $options: "i" } },
              { username: { $regex: searchRegex, $options: "i" } },
            ],
          },
          options: { sort: { name: "asc", username: "asc" } },
          populate: { path: "blockedContacts" },
        })
        .populate("blockedContacts")
        .sort({ name: "asc", username: "asc" });
    },
    allContactsExceptByUser: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const searchTerm = args.searchByName || "";

      return User.find({
        _id: {
          $ne: context.currentUser.id,
          $nin: context.currentUser.contacts,
        },
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { username: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .populate("blockedContacts")
        .sort({ name: "asc", username: "asc" });
    },
    checkIfUserHasBlockedYou: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      if (!args.userId) {
        throw new GraphQLError("User ID is required", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.userId,
          },
        });
      }

      try {
        const user = await User.findById(args.userId);

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.userId,
            },
          });
        }

        return user.blockedContacts.some(
          (blockedId) =>
            blockedId.toString() === context.currentUser.id.toString()
        );
      } catch (error) {
        throw new GraphQLError("Error checking block status", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
    },
    me: async (root, args, context) =>
      User.findById(context.currentUser).populate("blockedContacts"),
  },
};

export default { typeDefs, resolvers };
