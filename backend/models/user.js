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
  image: {
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
  settings: {
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
    time: {
      type: String,
      default: "24h",
      enum: ["12h", "24h"],
    },
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

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (!returnedObject.id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    }
    delete returnedObject.__v;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
