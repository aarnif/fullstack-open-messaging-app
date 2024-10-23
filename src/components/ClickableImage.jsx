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
      <div className="p-16 w-full h-full flex justify-center items-center">
        <img
          src={fullScreenImageUri}
          alt="Full screen image"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

const ClickableImage = ({
  imageUri,
  imageAlt,
  fullScreenImageUri,
  className = "w-[120px] h-[120px] rounded-full",
}) => {
  const [showImageView, setShowImageView] = useState(false);

  return (
    <>
      <button onClick={() => setShowImageView(true)}>
        <img src={imageUri} alt={imageAlt} className={className} />
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
