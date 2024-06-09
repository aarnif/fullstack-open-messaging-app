import user from "./queries/user.js";
import chat from "./queries/chat.js";
import message from "./queries/message.js";

import pkg from "lodash";
const { merge } = pkg;

import { makeExecutableSchema } from "@graphql-tools/schema";

const Query = `
  type Query {
    _empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [Query, user.typeDefs, chat.typeDefs, message.typeDefs],
  resolvers: merge(
    resolvers,
    user.resolvers,
    chat.resolvers,
    message.resolvers
  ),
});

export default schema;
