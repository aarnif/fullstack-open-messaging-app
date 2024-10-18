const ChangeImage = ({ currentImage, imageType, onClick }) => {
  return (
    <button className="mb-5" type="button" onClick={onClick}>
      <div className="w-full p-4 flex flex-col justify-center items-center rounded-lg bg-slate-200">
        <img
          src={currentImage}
          alt={`${imageType} image`}
          className="w-32 h-32 rounded-full"
        />
        <p className="my-2 text-md font-semibold text-slate-700">
          Change {imageType} image
        </p>
      </div>
    </button>
  );
};

export default ChangeImage;
