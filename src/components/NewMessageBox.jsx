import { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const ImagePreview = ({ image, handleCancelImage }) => {
  return (
    <div className="p-4 w-full bg-slate-100 flex flex-col justify-center items-center">
      <div className="w-full flex justify-end items-center">
        <button onClick={handleCancelImage}>
          <MdClose className="w-7 h-7 text-slate-700 fill-current" />
        </button>
      </div>
      <img
        src={image}
        alt="message-image"
        className="max-h-40 w-auto object-contain"
      />
    </div>
  );
};

const NewMessageBox = ({
  message,
  setMessage,
  image,
  setImage,
  setBase64Image,
  handleSubmit,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageImageRef = useRef(null);

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Image(base64String);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickAddImage = () => {
    console.log("Handle change chat image.");
    messageImageRef.current.click();
  };

  const handleCancelImage = () => {
    setImage(null);
    setBase64Image(null);
    messageImageRef.current.value = null;
  };

  return (
    <>
      {image && (
        <ImagePreview image={image} handleCancelImage={handleCancelImage} />
      )}
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
        <div className="mx-2 flex justify-center items-center space-x-2">
          <button onClick={handleClickAddImage}>
            <FaImage size={26} color="#16a34a" />
            <input
              ref={messageImageRef}
              hidden={true}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="mt-2"
            />
          </button>
        </div>
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
