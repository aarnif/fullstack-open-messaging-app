import express from "express";
import imageController from "../controllers/imageController.js";

const route = express.Router();

route.get("/chats/:chatId", imageController.getChatImage);

export default route;
