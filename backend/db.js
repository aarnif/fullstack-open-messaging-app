import mongoose from "mongoose";
import config from "../config.js";

const connectDB = async () => {
  try {
    console.log("connecting to MongoDB");
    await mongoose.connect(config.MONGODB_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("error connecting to MongoDB:", error.message);
  }
};

const disconnectDB = async () => {
  console.log("close connection to MongoDB");
  await mongoose.connection.close();
};

export default {
  connect: connectDB,
  disconnect: disconnectDB,
};
