import User from "../../models/user.js";
import Chat from "../../models/chat.js";

import pubsub from "../../pubsub.js";

import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const typeDefs = `
  extend type Mutation {
    createUser(
      username: String!
      password: String!
      confirmPassword: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    logout: User
    addContacts(
      userIds: [ID!]
    ): User
    removeContact(
      contactId: ID!
    ): String!
    editProfile(
      name: String
      about: String
      input: ImageInput
    ): User
    editSettings(
      theme: String
      time: String
    ): User
    blockOrUnBlockContact(
      contactId: ID!
    ): Boolean
  }
  type blockedOrUnBlocked {
    isBlocked: Boolean
    actor: ID!
    target: User
  }
  type Subscription {
    contactBlockedOrUnBlocked: blockedOrUnBlocked
  }   
`;

const resolvers = {
  Mutation: {
    createUser: async (root, args) => {
      const validateInput = () => {
        const validationError = {
          invalidArgs: [],
          message: "",
        };
        if (args.username.length < 4) {
          validationError.invalidArgs.push(args.username);
          validationError.message =
            "Username must be at least 4 characters long!";
          return validationError;
        } else if (args.password.length < 6) {
          validationError.invalidArgs.push(args.password);
          validationError.message =
            "Password must be at least 6 characters long!";
          return validationError;
        } else if (args.password !== args.confirmPassword) {
          validationError.invalidArgs.push(args.confirmPassword);
          validationError.message = "Passwords do not match!";
          return validationError;
        }

        return null;
      };

      const validationError = validateInput();
      if (validationError) {
        throw new GraphQLError(validationError.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: validationError.invalidArgs,
          },
        });
      }

      const existingUser = await User.findOne({ username: args.username });
      if (existingUser) {
        throw new GraphQLError("Username already exists!", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
          },
        });
      }

      try {
        const passwordHash = await bcrypt.hash(args.password, 10);

        const user = new User({
          username: args.username,
          passwordHash,
          name: args.username[0].toUpperCase() + args.username.slice(1),
        });

        return await user.save();
      } catch (error) {
        throw new GraphQLError("Failed to create user", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const error = new GraphQLError("Invalid username or password!", {
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args,
        },
      });

      if (!user) {
        console.log("Invalid username!");
        throw error;
      }

      const passwordMatch = await bcrypt.compare(
        args.password,
        user.passwordHash
      );

      if (!passwordMatch) {
        console.log("Password does not match!");
        throw error;
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    logout: async (root, args, context) => {
      context.currentUser = null;
      return context.currentUser;
    },
    addContacts: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const findContacts = await User.find({ _id: { $in: args.userIds } });

      if (!findContacts.length) {
        throw new GraphQLError("Contacts not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.userIds,
          },
        });
      }

      const user = await User.findByIdAndUpdate(
        context.currentUser,
        {
          $addToSet: { contacts: { $each: args.userIds } },
        },
        { new: true }
      )
        .populate("contacts")
        .populate({
          path: "contacts",
          populate: { path: "blockedContacts" },
        });

      return user;
    },
    removeContact: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const removeContactFromUser = await User.findByIdAndUpdate(
        context.currentUser,
        {
          $pull: { contacts: args.contactId },
        }
      );

      return args.contactId;
    },
    editProfile: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.currentUser,
        {
          $set: { ...args, image: args.input },
        },
        {
          new: true,
        }
      );

      return updatedUser;
    },
    editSettings: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.currentUser,
        { $set: { settings: args } },
        {
          new: true,
        }
      );

      return updatedUser;
    },
    blockOrUnBlockContact: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      let result = null;

      const checkIfContactBlocked =
        context.currentUser.blockedContacts.includes(args.contactId);

      const userToBeBlockedOrUnBlocked = await User.findById(
        args.contactId
      ).populate("blockedContacts");

      if (checkIfContactBlocked) {
        await User.findByIdAndUpdate(context.currentUser, {
          $pull: { blockedContacts: args.contactId },
        });
        result = false;
      } else {
        await User.findByIdAndUpdate(context.currentUser, {
          $addToSet: { blockedContacts: args.contactId },
        });
        result = true;
      }

      pubsub.publish("CONTACT_BLOCKED_OR_UNBLOCKED", {
        contactBlockedOrUnBlocked: {
          isBlocked: result,
          actor: context.currentUser.id,
          target: userToBeBlockedOrUnBlocked,
        },
      });

      return result;
    },
  },
  Subscription: {
    contactBlockedOrUnBlocked: {
      subscribe: () => pubsub.asyncIterator("CONTACT_BLOCKED_OR_UNBLOCKED"),
    },
  },
};

export default { typeDefs, resolvers };
