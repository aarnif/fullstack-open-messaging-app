import express from "express";
import imageController from "../controllers/imageController.js";

const route = express.Router();

route.get("/chats/:chatId", imageController.getChatImage);
route.get("/contacts/:contactId", imageController.getContactImage);

export default route;
