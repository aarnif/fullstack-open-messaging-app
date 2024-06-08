import "dotenv/config";

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.wr1sesb.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0`;

export default { MONGODB_URI };
