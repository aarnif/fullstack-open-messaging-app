import ClickableImage from "../ClickableImage";

const IndividualContactCard = ({ user, contact }) => {
  return (
    <>
      <div className="w-full flex-grow py-4 flex flex-col justify-start items-center">
        <h2 className="text-2xl font-bold mt-4 mx-4 mb-2">
          {user.username === contact.username ? "You" : "Contact"}
        </h2>
        <div className="w-full py-4 flex flex-col justify-center items-center">
          <ClickableImage
            imageUri={contact.image.thumbnail}
            imageAlt={`${contact.name}'s profile`}
            fullScreenImageUri={contact.image.original}
          />
          <div className="mt-4 text-xl text-slate-800 font-bold ">
            {contact.name}
          </div>
          <div className="text-md text-slate-500 font-bold ">
            @{contact.username}
          </div>
          <div className="mt-4 mx-8 text-base text-slate-700 text-center ">
            {contact.about}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualContactCard;
