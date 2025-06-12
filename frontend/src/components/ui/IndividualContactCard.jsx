import ClickableImage from "./ClickableImage";
import Title from "./Title";

const IndividualContactCard = ({ user, contact }) => {
  return (
    <div
      data-testid="individual-contact-card"
      className="w-full flex flex-col justify-start items-center"
    >
      <Title
        variant="primary"
        testId="individual-contact-card-title"
        text={user.username === contact.username ? "You" : "Contact"}
      />
      <div className="w-full py-4 flex flex-col justify-center items-center">
        <ClickableImage
          imageUri={contact.image.thumbnail}
          imageAlt={`${contact.name}'s profile`}
          fullScreenImageUri={contact.image.original}
        />
        <Title
          variant="secondary"
          testId="individual-contact-card-title"
          text={contact.name}
        />
        <p className="text-mobile text-slate-500 dark:text-slate-300 font-bold">
          @{contact.username}
        </p>
        <p className="mt-4 mx-8 text-base text-slate-800 dark:text-slate-100 text-center">
          {contact.about}
        </p>
      </div>
    </div>
  );
};

export default IndividualContactCard;
