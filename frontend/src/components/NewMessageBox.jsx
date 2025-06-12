import { useState, useRef } from "react";
import { FaImage } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";

import Button from "./ui/Button";
import Input from "./ui/Input";

const ImagePreview = ({ image, handleCancelImage }) => {
  return (
    <div className="relative p-4 w-full flex justify-center items-center bg-slate-50 dark:bg-slate-800">
      <img
        src={image}
        alt="message-image"
        className="max-h-40 w-auto object-contain"
      />
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          variant="close"
          testId="cancel-image-button"
          onClick={handleCancelImage}
        />
      </div>
    </div>
  );
};

const NewMessageBox = ({
  user,
  message,
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
          onEmojiClick={(emoji) =>
            message.setValue((prev) => prev + emoji.emoji)
          }
          style={{
            backgroundColor:
              user.settings.theme === "dark" ? "#1e293b" : "#f1f5f9",
          }}
        />
      </div>
      <div className="px-4 w-full max-h-[50px] p-2 flex gap-2 bg-white dark:bg-slate-700 lg:shadow-lg">
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

        <Input item={message} testId="new-message-input" />

        <Button
          type="button"
          variant="add-emoji-to-message"
          testId="show-emoji-picker-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <Button
          type="button"
          variant="send-new-message"
          testId="send-new-message-button"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewMessageBox;
