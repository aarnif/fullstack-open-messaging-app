import { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const ImagePreview = ({ image, handleCancelImage }) => {
  return (
    <div className="p-4 w-full bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center">
      <div className="w-full flex justify-end items-center">
        <button data-testid="cancel-image-button" onClick={handleCancelImage}>
          <MdClose className="w-7 h-7 text-slate-700 dark:text-slate-200 fill-current" />
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
  user,
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
      <div
        data-testid="emoji-picker"
        className="absolute bottom-[50px] right-4"
      >
        <EmojiPicker
          open={showEmojiPicker}
          onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
          style={{
            backgroundColor:
              user.settings.theme === "dark" ? "#1e293b" : "#f1f5f9",
          }}
        />
      </div>
      <div className="w-full h-[50px] p-2 flex bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 lg:shadow-lg">
        <div className="mx-2 flex justify-center items-center space-x-2">
          <button data-testid="add-image-button" onClick={handleClickAddImage}>
            <FaImage
              size={26}
              className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-green-600"
            />
            <input
              data-testid="image-input"
              ref={messageImageRef}
              hidden={true}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="mt-2"
            />
          </button>
        </div>

        <div
          data-testid="new-message-box"
          className="w-full flex justify-center items-center border-2 rounded-full border-slate-200 dark:border-slate-500 bg-slate-200 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition"
        >
          <input
            data-testid="new-message-input"
            className="w-full pl-3 rounded-full text-mobile sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-200 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
            placeholder="New Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="mx-2 flex justify-center items-center space-x-2">
          <button
            data-testid="show-emoji-picker-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaRegSmile className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-green-600" />
          </button>
          <button data-testid="send-new-message-button" onClick={handleSubmit}>
            <MdSend className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-green-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default NewMessageBox;
