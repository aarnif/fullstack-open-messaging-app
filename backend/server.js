import config from "../config.js";
import schema from "./graphql/schema.js";
import User from "./models/user.js";
import db from "./db.js";

import http from "http";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const getUserFromToken = async (token) => {
  if (token && token.startsWith("Bearer ")) {
    const decodedToken = jwt.verify(token.substring(7), config.JWT_SECRET);
    return await User.findById(decodedToken.id);
  }
  return null;
};

const start = async () => {
  await db.connect();

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const auth =
          ctx.connectionParams?.Authorization ||
          ctx.connectionParams?.headers?.authorization;
        const currentUser = await getUserFromToken(auth);
        return { currentUser };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || null;
        const currentUser = await getUserFromToken(auth);
        return { currentUser };
      },
    })
  );

  if (process.env.NODE_ENV === "test") {
    console.log("Running server in test mode...");
  }

  const PORT = config.PORT;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on port ${PORT}`)
  );

  return server;
};

export default { start };
