import config from "./config.js";
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

const selectRandomChatParticipant = (participants) =>
  participants[Math.floor(Math.random() * participants.length)];

const getRandomUsers = (users) => {
  const numItems = Math.floor(Math.random() * 3) + 3;
  const shuffledUsers = users.sort(() => 0.5 - Math.random());
  return shuffledUsers.slice(0, numItems);
};

const emptyDataBase = async () => {
  await User.deleteMany({});
  await Chat.deleteMany({});
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const addUsers = async () => {
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

const addChats = async () => {
  console.log("adding chats...");
  for (let i = 0; i < chats.length; ++i) {
    const chat = chats[i];
    chat.participants = getRandomUsers(usersInDataBase);

    const testUser = findUserFromUsersDataBase("test");

    const chatParticipantNames = chat.participants.map(
      (participant) => participant.username
    );

    // Add the test user to every chat
    if (!chatParticipantNames.includes(testUser.username)) {
      chat.participants.push(findUserFromUsersDataBase("test"));
    }

    chat.messages = chat.messages.map((message) => {
      return {
        ...message,
        sender: selectRandomChatParticipant(chat.participants),
      };
    });

    // Save messages to the chat from the last message to the first
    chat.messages.reverse();

    chat.latestMessage = chat.messages[0];
    const addChat = await new Chat(chat).save();
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

main();
