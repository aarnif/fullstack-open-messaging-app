import Chat from "../models/chat.js";
import User from "../models/user.js";

import asyncHandler from "express-async-handler";

const getChatImage = asyncHandler(async (req, res) => {
  const findChat = await Chat.findById(req.params.chatId);
  let chatImage = findChat.image;

  if (!findChat.isGroupChat) {
    const findAnotherUser = await User.findById(findChat.participants[1]);
    chatImage = findAnotherUser.profilePicture;
    res.sendFile(chatImage, { root: "./assets/images/profiles" });
    return;
  }

  res.sendFile(chatImage, { root: "./assets/images/chats" });
});

const getContactImage = asyncHandler(async (req, res) => {
  const findContact = await User.findById(req.params.contactId);
  res.sendFile(findContact.profilePicture, {
    root: "./assets/images/profiles",
  });
});

export default {
  getChatImage,
  getContactImage,
};
