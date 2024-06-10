import User from "../../models/user.js";

import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";

const typeDefs = `
  extend type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
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
      if (args.password.length < 6) {
        error.message = "Password must be at least 6 characters long";
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
  },
};

export default { typeDefs, resolvers };
