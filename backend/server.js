import config from "../config.js";
import schema from "./graphql/schema.js";
import User from "./models/user.js";
import testingRouter from "./routes/testing.js";

import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";

import http from "http";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const start = async () => {
  const JWT_SECRET = config.JWT_SECRET;
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        const auth =
          ctx.connectionParams?.Authorization ||
          ctx.connectionParams?.headers?.authorization; // Whether the client is using apollo server or apollo client
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
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
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    })
  );

  if (process.env.NODE_ENV === "test") {
    console.log("Running in test mode");
    app.use("/api/testing", testingRouter);
  }

  const PORT = config.PORT;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on port ${PORT}`)
  );

  return server;
};

export default { start };
