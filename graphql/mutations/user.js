import User from "../../models/user.js";
import Chat from "../../models/chat.js";

import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const typeDefs = `
  extend type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    logout: User
    addContacts(
      contacts: [ID!]
    ): User
    editProfile(
      name: String
      about: String
      input: ImageInput
    ): User
    blockOrUnBlockContact(
      contactId: ID!
    ): Boolean
  }
  type Subscription {
    contactsAdded: [User]
  }   
`;

const resolvers = {
  Mutation: {
    createUser: async (root, args) => {
      const error = new GraphQLError({
        extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args.password,
        },
      });
      const checkIfUserNameExists = await User.findOne({
        username: args.username,
      });

      if (checkIfUserNameExists) {
        error.message = "Username already exists!";
        throw error;
      }

      if (args.password.length < 6) {
        error.message = "Password must be at least 6 characters long!";
        throw error;
      }

      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = new User({
        username: args.username,
        passwordHash: passwordHash,
      });

      try {
        await user.save();
      } catch (error) {
        throw error;
      }
      return user;
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

      const findContacts = await User.find({ _id: { $in: args.contacts } });

      if (!findContacts.length) {
        throw new GraphQLError("Contacts not found!", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.contacts,
          },
        });
      }

      console.log("Adding contacts: ", args.contacts);

      const user = await User.findByIdAndUpdate(context.currentUser, {
        $addToSet: { contacts: { $each: args.contacts } },
      }).populate("contacts");

      const addedContacts = await User.find({ _id: { $in: args.contacts } });

      pubsub.publish("CONTACTS_ADDED", { contactsAdded: addedContacts });

      return user;
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
          $set: args,
          $set: { profilePicture: args.input },
        },
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
      return result;
    },
  },
  Subscription: {
    contactsAdded: {
      subscribe: () => pubsub.asyncIterator("CONTACTS_ADDED"),
    },
  },
};

export default { typeDefs, resolvers };
