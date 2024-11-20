const DropDownMenuItem = ({ menuItem }) => {
  return (
    <li className="w-full my-2">
      <button
        onClick={menuItem.handleClick}
        data-testid={menuItem["data-testid"]}
        className="w-full p-2 flex justify-start items-center rounded-xl text-md text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
      >
        {menuItem.title}
      </button>
    </li>
  );
};

const NewChatDropDownBox = ({
  setShowNewChatDropdownBox,
  setShowNewPrivateChatModal,
  setShowNewGroupChatModal,
}) => {
  const menuItems = [
    {
      id: 1,
      title: "New Private Chat",
      handleClick: () => {
        setShowNewChatDropdownBox(false);
        setShowNewPrivateChatModal(true);
      },
      "data-testid": "new-private-chat-button",
    },
    {
      id: 2,
      title: "New Group Chat",
      handleClick: () => {
        setShowNewChatDropdownBox(false);
        setShowNewGroupChatModal(true);
      },
      "data-testid": "new-group-chat-button",
    },
  ];

  return (
    <div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center z-10"
      onClick={() => setShowNewChatDropdownBox(false)}
    >
      <div className="absolute top-[70px] left-[500px] flex-grow p-4 flex flex-col justify-center items-center bg-white dark:bg-slate-800 rounded-xl text-slate-700 z-10">
        <ul className="flex-grow w-full">
          {menuItems.map((menuItem) => (
            <DropDownMenuItem key={menuItem.id} menuItem={menuItem} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewChatDropDownBox;
