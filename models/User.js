import mongoose from "mongoose";

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
    thumbnail: {
      type: String,
      default: "https://i.ibb.co/vJDhmJJ/profile-placeholder.png",
    },
    original: {
      type: String,
      default: "https://i.ibb.co/cNxwtNN/profile-placeholder.png",
    },
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
  blockedContacts: [
    {
      type: String,
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
