import { PubSub } from "graphql-subscriptions";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import config from "../config.js";

const connectToRedis = () => {
  const redisOptions = {
    host: config.REDIS_DOMAIN_NAME,
    port: config.REDIS_PORT,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  };

  const publisher = new Redis(redisOptions);
  const subscriber = new Redis(redisOptions);

  publisher.on("connect", () => console.log("Redis publisher connected"));
  publisher.on("error", (error) =>
    console.error("Redis publisher error", error)
  );

  subscriber.on("connect", () => console.log("Redis subscriber connected"));
  subscriber.on("error", (error) =>
    console.error("Redis subscriber error", error)
  );

  return new RedisPubSub({
    publisher: publisher,
    subscriber: subscriber,
  });
};

const pubsub =
  process.env.NODE_ENV === "production" ? connectToRedis() : new PubSub();

export default pubsub;
