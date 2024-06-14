import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "anonymous.png",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
