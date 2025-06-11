import { motion } from "framer-motion";

import Button from "../ui/Button";

const DropDownMenuItem = ({ menuItem }) => {
  return (
    <Button
      type="button"
      variant="new-chat-button"
      testId={menuItem["data-testid"]}
      text={menuItem.title}
      onClick={menuItem.handleClick}
    />
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
      <motion.div
        data-testid="new-chat-dropdown-box"
        className="absolute top-20 right-12 lg:right-auto lg:left-[510px] p-4 flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800 rounded-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="w-full flex flex-col justify-center items-center gap-2">
          {menuItems.map((menuItem) => (
            <DropDownMenuItem key={menuItem.id} menuItem={menuItem} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NewChatDropDownBox;
