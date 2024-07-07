import config from "../config.js";

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(config.CLOUDINARY);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: cloudinary.url("profile_placeholder"),
  },
  status: {
    type: String,
    default: "offline",
    enum: ["online", "offline"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
