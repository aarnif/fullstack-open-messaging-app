const ContactCard = ({ user, item }) => {
  return (
    <div className="mr-4 flex-grow flex items-start">
      <div>
        <img
          className="w-16 h-16 rounded-full"
          src={item.image.thumbnail}
          alt={item.name}
        />
      </div>
      <div className="flex-grow ml-4">
        {user?.id === item.id ? (
          <div className="text-md text-slate-700 font-bold">You</div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="text-md text-slate-700 font-bold">
                {item.name}
              </div>
              <div className="text-md text-slate-500 font-bold">
                @{item.username}
              </div>
            </div>
            <div className="text-sm text-slate-700 text-left">{item.about}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
