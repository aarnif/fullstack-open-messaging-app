import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("messaging-app-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({ uri: import.meta.env.VITE_APOLLO_URI });

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_APOLLO_WS_URI,
    connectionParams: () => {
      const token = localStorage.getItem("messaging-app-user-token");
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : null,
        },
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allChatsByUser: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
        me: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Chat: {
      fields: {
        members: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
        messages: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
      },
    },
    User: {
      fields: {
        blockedContacts: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
        unreadMessages: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
        contacts: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
        chats: {
          merge(_, incoming = []) {
            return [...incoming];
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  cache: cache,
  link: splitLink,
});

export default client;
