import Chat from "../models/chat.js";
import User from "../models/user.js";

import asyncHandler from "express-async-handler";
import fs from "fs";

const getChatImage = asyncHandler(async (req, res) => {
  const findChat = await Chat.findById(req.params.chatId);
  let imageFile = "chat_placeholder.png";

  if (fs.existsSync(`./assets/images/chats/${findChat.image}`)) {
    imageFile = findChat.image;
  }

  if (findChat.participants.length === 2) {
    const findAnotherUser = await User.findById(findChat.participants[1]);
    imageFile = findAnotherUser.profilePicture;
    res.sendFile(imageFile, { root: "./assets/images/profiles" });
    return;
  }

  res.sendFile(imageFile, { root: "./assets/images/chats" });
});

const getContactImage = asyncHandler(async (req, res) => {
  const findContact = await User.findById(req.params.contactId);
  let imageFile = "profile_placeholder.png";

  if (fs.existsSync(`./assets/images/profiles/${findContact.profilePicture}`)) {
    imageFile = findContact.profilePicture;
  }

  res.sendFile(imageFile, { root: "./assets/images/profiles" });
});

export default {
  getChatImage,
  getContactImage,
};
