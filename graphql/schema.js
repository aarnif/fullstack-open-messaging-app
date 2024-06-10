import userQueries from "./queries/user.js";
import chatQueries from "./queries/chat.js";
import messageQueries from "./queries/message.js";

import userMutations from "./mutations/user.js";
import chatMutations from "./mutations/chat.js";
import messageMutations from "./mutations/message.js";

import pkg from "lodash";
const { merge } = pkg;

import { makeExecutableSchema } from "@graphql-tools/schema";

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [
    Query,
    Mutation,
    userQueries.typeDefs,
    chatQueries.typeDefs,
    messageQueries.typeDefs,
    userMutations.typeDefs,
    chatMutations.typeDefs,
    messageMutations.typeDefs,
  ],
  resolvers: merge(
    resolvers,
    userQueries.resolvers,
    chatQueries.resolvers,
    messageQueries.resolvers,
    userMutations.resolvers,
    chatMutations.resolvers,
    messageMutations.resolvers
  ),
});

export default schema;
