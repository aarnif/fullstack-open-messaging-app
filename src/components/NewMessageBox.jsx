import { useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const NewMessageBox = ({ message, setMessage, handleSubmit }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <>
      <div className="absolute bottom-[50px] right-4">
        <EmojiPicker
          open={showEmojiPicker}
          onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
          style={{
            backgroundColor: "#f1f5f9",
          }}
        />
      </div>
      <div className="w-full h-[50px] p-2 flex bg-white text-slate-800">
        <input
          className="w-full p-2 bg-slate-100 rounded-xl"
          placeholder="New Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mx-2 flex justify-center items-center space-x-2">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FaRegSmile size={26} color="#16a34a" />
          </button>
          <button onClick={handleSubmit}>
            <MdSend size={26} color="#16a34a" />
          </button>
        </div>
      </div>
    </>
  );
};

export default NewMessageBox;
