const Chats = ({ menuComponent }) => {
  return (
    <div data-testid="chats-page" className="flex-grow flex">
      {menuComponent}
      <div className="hidden flex-grow lg:flex justify-center items-center">
        <p className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold">
          Select Chat to Start Messaging.
        </p>
      </div>
    </div>
  );
};

export default Chats;
