import config from "./config.js";
import User from "./models/user.js";
import Chat from "./models/chat.js";
import Message from "./models/message.js";
import users from "./dummyData/users.js";
import chats from "./dummyData/chats.js";
import messages from "./dummyData/messages.js";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGODB_URI = config.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

const emptyDataBase = async () => {
  await User.deleteMany({});
  await Chat.deleteMany({});
  await Message.deleteMany({});
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const addUsers = async () => {
  console.log("adding users...");
  for (let i = 0; i < users.length; ++i) {
    let user = users[i];
    const hashedPassword = await hashPassword(user.password);
    user = { ...user, passwordHash: hashedPassword };
    const addUser = await new User(user).save();
  }
};

const addChats = async () => {
  console.log("adding chats...");
  for (let i = 0; i < chats.length; ++i) {
    const chat = chats[i];
    const chatParticipants = await User.find({
      username: {
        $in: chat.participants.map((participant) => participant.username),
      },
    });
    chat.participants = chatParticipants;
    const addChat = await new Chat(chat).save();
    chatParticipants.forEach(async (participant) => {
      const updatedUser = await User.findOne({
        username: participant.username,
      });
      updatedUser.chats = updatedUser.chats.concat(addChat);
      await updatedUser.save();
    });
  }
};

const addMessages = async () => {
  console.log("adding messages...");
  for (let i = 0; i < chats.length; ++i) {
    const chatMessages = messages[i];
    for (let j = 0; j < chatMessages.length; ++j) {
      const chatMessage = chatMessages[j];
      const sender = await User.findOne({
        username: chatMessage.sender.username,
      });
      const chat = await Chat.findOne({
        title: chats[i].title,
      });
      chatMessage.sender = sender;
      chatMessage.chat = chat;
      const addMessage = await new Message(chatMessage).save();
      chat.messages = chat.messages.concat(addMessage);
      await chat.save();
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
    await addMessages();
    console.log("close connection to MongoDB");
    mongoose.connection.close();
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
  }
};

main();
