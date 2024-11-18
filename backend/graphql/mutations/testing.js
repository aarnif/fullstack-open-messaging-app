import Chat from "../../models/chat.js";
import User from "../../models/user.js";

const typeDefs = `
  extend type Mutation {
    resetDatabase: Boolean
  } 
`;

const resolvers = {
  Mutation: {
    resetDatabase: async (root, args, context) => {
      console.log("Reseting database...");
      await Chat.deleteMany({});
      await User.deleteMany({});
      console.log("Database reseted!");
      return true;
    },
  },
};

export default { typeDefs, resolvers };
