import "dotenv/config";

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const VITE_APOLLO_URI =
  process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
    ? `http://localhost:${PORT}`
    : "https://fullstack-open-messaging-app-api.onrender.com/";

const VITE_APOLLO_WS_URI =
  process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
    ? `ws://localhost:${PORT}`
    : "wss://fullstack-open-messaging-app-api.onrender.com/";

const VITE_IMGBB_API_KEY = process.env.VITE_IMGBB_API_KEY;

const REDIS_URI = process.env.REDIS_URI;

export default {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
  VITE_APOLLO_URI,
  VITE_APOLLO_WS_URI,
  VITE_IMGBB_API_KEY,
  REDIS_URI,
};
