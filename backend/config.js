import "dotenv/config";

const PORT = process.env.NODE_ENV === "test" ? 4001 : process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const VITE_APOLLO_URI = process.env.VITE_APOLLO_URI;
const VITE_APOLLO_WS_URI = process.env.VITE_APOLLO_WS_URI;
const VITE_IMGBB_API_KEY = process.env.VITE_IMGBB_API_KEY;

export default {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
  VITE_APOLLO_URI,
  VITE_APOLLO_WS_URI,
  VITE_IMGBB_API_KEY,
};
