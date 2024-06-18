import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageContent = {
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

const chatSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  image: {
    type: String,
    default: "chat-placeholder.png",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [messageContent],
  latestMessage: messageContent,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
