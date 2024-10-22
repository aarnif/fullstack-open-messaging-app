import { useState } from "react";

const FullScreenView = ({
  fullScreenImageUri,
  showImageView,
  setShowImageView,
}) => {
  if (!showImageView) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowImageView(false)}
    >
      <div className="p-8 flex flex-col justify-center items-center">
        <img
          src={fullScreenImageUri}
          alt="Full screen image"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

const ClickableImage = ({ imageUri, imageAlt, fullScreenImageUri }) => {
  const [showImageView, setShowImageView] = useState(false);

  return (
    <>
      <button onClick={() => setShowImageView(true)}>
        <img
          src={imageUri}
          alt={imageAlt}
          className="w-[120px] h-[120px] rounded-full"
        />
      </button>
      <FullScreenView
        fullScreenImageUri={fullScreenImageUri}
        showImageView={showImageView}
        setShowImageView={setShowImageView}
      />
    </>
  );
};

export default ClickableImage;
