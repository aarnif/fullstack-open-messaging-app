import config from "../config.js";
import User from "./models/user.js";
import Chat from "./models/chat.js";
import users from "./dummyData/users.js";
import chats from "./dummyData/chats.js";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGODB_URI = config.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

const usersInDataBase = [];

const findUserFromUsersDataBase = (username) =>
  usersInDataBase.find((user) => user.username === username);

const selectRandomChatMember = (members) =>
  members[Math.floor(Math.random() * members.length)];

const addChatMembersRandomly = (users) => {
  const numItems = Math.floor(Math.random() * 3) + 3;
  const shuffledUsers = users.sort(() => 0.5 - Math.random());
  return shuffledUsers.slice(0, numItems);
};

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
    const addUser = await new User(user).save();
    usersInDataBase.push(addUser);
  }

  // Put all the contacts to the test user only
  const allUsers = await User.find({ username: { $ne: users[0].username } });
  const addContactsToUser = await User.findOneAndUpdate(
    { username: users[0].username },
    { contacts: allUsers },
    { new: true }
  );
};

export const addChats = async () => {
  console.log("adding chats...");
  for (let i = 0; i < chats.length; ++i) {
    const chat = chats[i];
    chat.members = addChatMembersRandomly(usersInDataBase);

    const testUser = findUserFromUsersDataBase("test");

    const chatMemberNames = chat.members.map((member) => member.username);

    // Add the test user to every chat
    if (!chatMemberNames.includes(testUser.username)) {
      chat.members.push(findUserFromUsersDataBase("test"));
    }

    // Make test user admin of every chat
    chat.admin = testUser;

    chat.messages = chat.messages.map((message) => {
      return {
        ...message,
        sender: selectRandomChatMember(chat.members),
        isReadBy: chat.members.map((member) => {
          return { member: member._id, isRead: true };
        }),
      };
    });

    // Save messages to the chat from the last message to the first
    chat.messages.reverse();

    const addChat = await new Chat(chat).save();
  }
};

export const addChatsToUsers = async () => {
  console.log("adding chats to users...");
  const allChats = await Chat.find({});
  for (let i = 0; i < allChats.length; ++i) {
    const chat = allChats[i];
    for (let j = 0; j < chat.members.length; ++j) {
      const member = chat.members[j];
      const user = await User.findById(member);
      user.chats = user.chats.concat(chat._id);
      await user.save();
    }
  }
};

const main = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    console.log("connected to MongoDB");
    await emptyDataBase();
    await addUsers();
    await addChats();
    await addChatsToUsers();
    console.log("close connection to MongoDB");
    mongoose.connection.close();
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
  }
};

if (process.env.NODE_ENV !== "test") {
  main();
}
