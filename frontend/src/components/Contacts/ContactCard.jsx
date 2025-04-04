const ContactCard = ({ user, item, admin }) => {
  const isCurrentUser = user?.id === item.id;
  const isAdmin = admin?.id === item.id;

  return (
    <div data-testid="contact-card" className="mr-4 flex-grow flex items-start">
      <div>
        <img
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
          src={item.image.thumbnail}
          alt={item.name}
        />
      </div>
      <div className="flex-grow ml-4">
        <div className="flex justify-between items-start">
          <div className="text-mobile lg:text-base text-slate-800 dark:text-slate-100 font-bold">
            {isCurrentUser ? "You" : item.name}{" "}
            {isAdmin && (
              <span className="text-mobile lg:text-base text-slate-700 dark:text-slate-200 font-semibold">
                Admin
              </span>
            )}
          </div>
          <div className="text-mobile lg:text-base text-slate-600 dark:text-slate-200 font-bold">
            @{item.username}
          </div>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-200 text-left">
          {item.about}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
