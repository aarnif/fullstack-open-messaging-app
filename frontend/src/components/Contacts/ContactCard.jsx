const ContactCard = ({ user, item, admin }) => {
  return (
    <div className="mr-4 flex-grow flex items-start">
      <div>
        <img
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
          src={item.image.thumbnail}
          alt={item.name}
        />
      </div>
      <div className="flex-grow ml-4">
        {user?.id === item.id ? (
          <>
            <div className="flex justify-between items-start">
              <div className="text-mobile lg:text-md text-slate-800 dark:text-slate-100 font-bold">
                You{" "}
                {admin?.id === item.id && (
                  <span className="text-mobile lg:text-md text-slate-700 dark:text-slate-200 font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-mobile lg:text-md text-slate-600 dark:text-slate-200 font-bold">
                @{item.username}
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-200 text-left">
              {item.about}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="text-mobile lg:text-md text-slate-800 dark:text-slate-100 font-bold">
                {item.name}{" "}
                {admin?.id === item.id && (
                  <span className="text-mobile lg:text-md text-slate-700 dark:text-slate-200 font-semibold">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-mobile lg:text-md text-slate-600 dark:text-slate-200 font-bold">
                @{item.username}
              </div>
            </div>
            <div className="text-sm ttext-slate-600 dark:text-slate-200 text-left">
              {item.about}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
