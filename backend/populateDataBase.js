import config from "../config.js";
import User from "./models/user.js";
import Chat from "./models/chat.js";
import users from "./dummyData/users.js";
import chats from "./dummyData/chats.js";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGODB_URI = config.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

export const emptyDataBase = async () => {
  console.log("emptying database...");
  await User.deleteMany({});
  await Chat.deleteMany({});
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const addUsers = async () => {
  console.log("adding users...");
  for (let i = 0; i < users.length; ++i) {
    let user = users[i];
    const hashedPassword = await hashPassword(user.password);
    user = { ...user, passwordHash: hashedPassword };
    await new User(user).save();
  }
};

export const addChats = async () => {
  console.log("adding chats...");
  for (let i = 0; i < chats.length; ++i) {
    const chat = chats[i];
    // Save messages to the chat from the last message to the first
    chat.messages.reverse();
    await new Chat(chat).save();
  }
};

const main = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    console.log("connected to MongoDB");
    await emptyDataBase();
    await addUsers();
    await addChats();
    console.log("close connection to MongoDB");
    mongoose.connection.close();
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
  }
};

if (process.env.NODE_ENV !== "test") {
  main();
}
