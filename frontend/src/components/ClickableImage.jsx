import { useState } from "react";
import { createPortal } from "react-dom";

const FullScreenView = ({ fullScreenImageUri, setShowImageView }) => {
  return createPortal(
    <div
      data-testid="full-screen-view"
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
    </div>,
    document.body
  );
};

const ClickableImage = ({
  imageUri,
  imageAlt,
  fullScreenImageUri,
  className = "w-24 h-24 lg:w-28 lg:h-28 rounded-full",
}) => {
  const [showImageView, setShowImageView] = useState(false);

  return (
    <>
      <button
        data-testid="show-fullscreen-view-button"
        onClick={() => setShowImageView(true)}
      >
        <img src={imageUri} alt={imageAlt} className={className} />
      </button>
      {showImageView && (
        <FullScreenView
          fullScreenImageUri={fullScreenImageUri}
          setShowImageView={setShowImageView}
        />
      )}
    </>
  );
};

export default ClickableImage;
