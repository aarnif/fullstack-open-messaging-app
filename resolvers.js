import User from "./models/user.js";

const resolvers = {
  Query: {
    allUsers: async () => User.find({}),
  },
};

export default resolvers;
