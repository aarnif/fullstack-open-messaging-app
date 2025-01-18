import { useState, useRef } from "react";

const ChangeImage = ({ currentImage, imageType, setBase64Image }) => {
  const [imagePreview, setImagePreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Image(base64String);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-5 flex justify-center items-center bg-slate-200 dark:bg-slate-800 rounded-lg">
      <button
        type="button"
        onClick={handleClick}
        className="p-4 flex flex-col justify-center items-center rounded-lg"
      >
        <img
          src={imagePreview}
          alt={`${imageType} image`}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
        />
        <div className="my-2 text-mobile lg:text-base font-semibold text-slate-800 dark:text-slate-100">
          Change {imageType} image
        </div>
        <input
          ref={fileInputRef}
          hidden={true}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
      </button>
    </div>
  );
};

export default ChangeImage;
