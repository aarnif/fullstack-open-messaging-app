import asyncHandler from "express-async-handler";

const getChatImage = asyncHandler(async (req, res) => {
  res.sendFile("anonymous.png", { root: "./assets/images" });
});

const getContactImage = asyncHandler(async (req, res) => {
  res.sendFile("anonymous.png", { root: "./assets/images" });
});

export default {
  getChatImage,
  getContactImage,
};
