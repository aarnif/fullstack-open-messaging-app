import config from "../config.js";

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(config.CLOUDINARY);

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  image: {
    type: String,
    default: cloudinary.url("chat_placeholder"),
  },
  description: {
    type: String,
    default: "",
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: {
        type: String,
        default: "message",
        enum: ["notification", "message"],
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
        minlength: 1,
      },
      isReadBy: [
        {
          member: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          isRead: {
            type: Boolean,
            default: false,
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
