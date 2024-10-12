const DropDownMenuItem = ({ menuItem }) => {
  return (
    <li className="w-full my-2">
      <button
        onClick={menuItem.handleClick}
        className="w-full p-2 flex justify-start items-center rounded-xl text-md font-bold hover:bg-slate-200 transition"
      >
        {menuItem.title}
      </button>
    </li>
  );
};

const NewChatDropDownBox = ({ setShowNewChatDropdownBox }) => {
  const menuItems = [
    { id: 1, title: "New Individual Chat", handleClick: () => {} },
    { id: 2, title: "New Group Chat", handleClick: () => {} },
  ];

  return (
    <div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center z-10"
      onClick={() => setShowNewChatDropdownBox(false)}
    >
      <div className="absolute top-[70px] left-[500px] flex-grow p-4 flex flex-col justify-center items-center bg-white rounded-xl text-slate-700 z-10">
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
