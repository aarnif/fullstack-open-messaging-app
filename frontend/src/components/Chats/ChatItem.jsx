import { useNavigate } from "react-router-dom";
import ChatCard from "./ChatCard";

const ChatItem = ({ user, item, activePath, setActivePath }) => {
  const navigate = useNavigate();

  const handlePress = () => {
    console.log("Pressed chat titled:", item.title);
    navigate(`/chats/${item.id}`);
    setActivePath(item.id);
  };

  if (!item.messages.length) {
    return (
      <div
        className="flex items-center my-2 mx-4 cursor-pointer"
        onClick={handlePress}
      >
        <div className="mr-4">
          <img
            className="w-16 h-16 rounded-full"
            src={item.displayChatImage.thumbnail}
            alt="Chat Thumbnail"
          />
        </div>
        <div className="flex-1">
          <div className="text-md font-bold">{item.displayChatTitle}</div>
          <div className="text-slate-800 dark:text-slate-100">No messages</div>
        </div>
      </div>
    );
  }

  const classStyles =
    activePath === item.id
      ? "w-full flex items-start py-2 px-4 border-b bg-slate-200 dark:bg-slate-700 transition"
      : "w-full flex items-start py-2 px-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button className={classStyles} onClick={handlePress}>
      <ChatCard user={user} chat={item} />
    </button>
  );
};

export default ChatItem;
