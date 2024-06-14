import Chat from "../models/chat.js";
import asyncHandler from "express-async-handler";

const getChatImage = asyncHandler(async (req, res) => {
  const chatById = await Chat.findById(req.params.chatId).exec();
  res.sendFile("anonymous.png", { root: "./assets/images" });
});

export default {
  getChatImage,
};
