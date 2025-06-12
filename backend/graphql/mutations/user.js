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
      theme: String!
      time: String!
    ): User
    changePassword(
      currentPassword: String!
      newPassword: String!
      confirmNewPassword: String!
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
      const authError = new GraphQLError("Invalid username or password!", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });

      const user = await User.findOne({ username: args.username });

      if (!user) {
        throw authError;
      }

      const passwordMatch = await bcrypt.compare(
        args.password,
        user.passwordHash
      );

      if (!passwordMatch) {
        throw authError;
      }

      try {
        const userForToken = {
          username: user.username,
          id: user._id,
        };

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
      } catch (error) {
        throw new GraphQLError("Failed to login!", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
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

      try {
        const user = await User.findByIdAndUpdate(
          context.currentUser.id,
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
      } catch (error) {
        throw new GraphQLError("Failed to add contacts!", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },
    removeContact: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const currentUser = await User.findById(context.currentUser.id);

      if (!currentUser.contacts.includes(args.contactId)) {
        throw new GraphQLError("Contact is not in your contacts", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.contactId,
          },
        });
      }

      try {
        await User.findByIdAndUpdate(currentUser._id, {
          $pull: { contacts: args.contactId },
        });

        return args.contactId;
      } catch (error) {
        throw new GraphQLError("Failed to remove contact!", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
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
        context.currentUser.id,
        {
          $set: { ...args, image: args.input },
        },
        {
          new: true,
        }
      ).populate("blockedContacts");

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

      const validThemes = ["light", "dark"];
      const validTimeFormats = ["12h", "24h"];

      if (!validThemes.includes(args.theme)) {
        throw new GraphQLError(
          "Invalid theme value. Must be 'light' or 'dark'.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.theme,
            },
          }
        );
      }

      if (!validTimeFormats.includes(args.time)) {
        throw new GraphQLError("Invalid time format. Must be '12h' or '24h'.", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.time,
          },
        });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.currentUser.id,
          { $set: { settings: args } },
          {
            new: true,
            runValidators: true,
          }
        );

        return updatedUser.populate("blockedContacts");
      } catch (error) {
        throw new GraphQLError("Failed to update settings!", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error,
          },
        });
      }
    },
    changePassword: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const user = await User.findById(context.currentUser.id);

      const passwordMatch = await bcrypt.compare(
        args.currentPassword,
        user.passwordHash
      );

      if (!passwordMatch) {
        throw new GraphQLError("Current password is incorrect!", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.currentPassword,
          },
        });
      }

      if (args.newPassword.length < 6) {
        throw new GraphQLError(
          "New password must be at least 6 characters long!",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.newPassword,
            },
          }
        );
      }

      if (args.newPassword !== args.confirmNewPassword) {
        throw new GraphQLError("New passwords do not match!", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.confirmNewPassword,
          },
        });
      }

      try {
        const newPasswordHash = await bcrypt.hash(args.newPassword, 10);

        const updatedUser = await User.findByIdAndUpdate(
          context.currentUser.id,
          { passwordHash: newPasswordHash },
          { new: true }
        );

        return updatedUser;
      } catch (error) {
        throw new GraphQLError("Failed to change password!", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
    },
    blockOrUnBlockContact: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not logged in!", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const currentUser = await User.findById(context.currentUser.id);

      if (!currentUser.contacts.includes(args.contactId)) {
        throw new GraphQLError(
          "The specified contact is not in your contact list.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.contactId,
            },
          }
        );
      }

      try {
        const contactToBeBlockedOrUnblocked = await User.findById(
          args.contactId
        ).populate("blockedContacts");

        if (!contactToBeBlockedOrUnblocked) {
          throw new GraphQLError("Contact not found", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.contactId,
            },
          });
        }

        const checkIfContactIsAlreadyBlocked =
          currentUser.blockedContacts.includes(args.contactId);
        let updatedUser;

        if (checkIfContactIsAlreadyBlocked) {
          updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $pull: { blockedContacts: args.contactId } },
            { new: true }
          );
        } else {
          updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $addToSet: { blockedContacts: args.contactId } },
            { new: true }
          );
        }

        const newBlockedState = updatedUser.blockedContacts.includes(
          args.contactId
        );

        pubsub.publish("CONTACT_BLOCKED_OR_UNBLOCKED", {
          contactBlockedOrUnBlocked: {
            isBlocked: newBlockedState,
            actor: currentUser._id.toString(),
            target: contactToBeBlockedOrUnblocked,
          },
        });

        return newBlockedState;
      } catch (error) {
        throw new GraphQLError("Failed to block/unblock contact", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
          },
        });
      }
    },
  },
  Subscription: {
    contactBlockedOrUnBlocked: {
      subscribe: () => pubsub.asyncIterator("CONTACT_BLOCKED_OR_UNBLOCKED"),
    },
  },
};

export default { typeDefs, resolvers };
