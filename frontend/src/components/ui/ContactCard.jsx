import Title from "./Title";

const ContactCard = ({ user, item, admin }) => {
  const isCurrentUser = user?.id === item.id;
  const isAdmin = admin?.id === item.id;

  return (
    <div data-testid="contact-card" className="w-full flex items-start gap-4">
      <img
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
        src={item.image.thumbnail}
        alt={item.name}
      />

      <div className="w-full flex flex-col">
        <div className="flex justify-between items-start">
          <Title
            variant="tertiary"
            testId={`contact-title-${item.id}`}
            text={
              <>
                {isCurrentUser ? "You" : item.name}{" "}
                {isAdmin && (
                  <span className="text-mobile lg:text-base text-slate-600 dark:text-slate-300 font-semibold">
                    Admin
                  </span>
                )}
              </>
            }
          />
          <p className="text-mobile lg:text-base text-slate-600 dark:text-slate-200 font-bold">
            @{item.username}
          </p>
        </div>
        <p className="text-mobile lg:text-base text-slate-600 dark:text-slate-200 text-left">
          {item.about}
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
