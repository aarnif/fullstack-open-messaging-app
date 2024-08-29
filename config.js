import "dotenv/config";

const PORT = process.env.NODE_ENV === "test" ? 4001 : 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { PORT, JWT_SECRET, MONGODB_URI };
