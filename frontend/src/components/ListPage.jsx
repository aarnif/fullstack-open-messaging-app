const ListPage = ({ type, menuComponent }) => {
  const messages = {
    chats: "Select Chat to Start Messaging.",
    contacts: "Select a contact for further information.",
  };

  return (
    <div data-testid={`${type}-page`} className="flex-grow flex">
      {menuComponent}
      <div className="hidden flex-grow lg:flex justify-center items-center">
        <p className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold">
          {messages[type]}
        </p>
      </div>
    </div>
  );
};

export default ListPage;
