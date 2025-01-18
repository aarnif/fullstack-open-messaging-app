const Chats = ({ menuComponent }) => {
  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="hidden flex-grow lg:flex justify-center items-center">
        <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold">
          Select Chat to Start Messaging.
        </div>
      </div>
    </div>
  );
};

export default Chats;
