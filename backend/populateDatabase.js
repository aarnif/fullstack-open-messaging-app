import User from "./models/user.js";
import Chat from "./models/chat.js";
import users from "./dummyData/users.js";
import chats from "./dummyData/chats.js";
import db from "./db.js";

import bcrypt from "bcrypt";

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
    await new Chat(chat).save();
  }
};

const main = async () => {
  try {
    await db.connect();
    await emptyDataBase();
    await addUsers();
    await addChats();
  } catch (error) {
    console.error("Error in database operations:", error.message);
  }
  await db.disconnect();
};

if (process.env.NODE_ENV !== "test") {
  main();
}
