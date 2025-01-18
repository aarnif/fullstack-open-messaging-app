import { useNavigate } from "react-router";
import ChatCard from "./ChatCard";

const ChatItem = ({
  index,
  user,
  item,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const navigate = useNavigate();

  const handlePress = () => {
    console.log("Pressed chat titled:", item.title);
    navigate(`/chats/${item.id}`);
    setActiveChatOrContactId(item.id);
  };

  if (!item.messages.length) {
    return (
      <div
        className="flex items-center my-2 mx-4 cursor-pointer"
        onClick={handlePress}
      >
        <div className="mr-4">
          <img
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
            src={item.image.thumbnail}
            alt="Chat Thumbnail"
          />
        </div>
        <div className="flex-1">
          <div className="text-mobile lg:text-md font-bold">{item.title}</div>
          <div className="text-mobile lg:text-md text-slate-800 dark:text-slate-100">
            No messages
          </div>
        </div>
      </div>
    );
  }

  const classStyles =
    activeChatOrContactId === item.id
      ? "w-full flex items-start py-2 px-4 border-b bg-slate-200 dark:bg-slate-700 transition"
      : "w-full flex items-start py-2 px-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button
      className={classStyles}
      data-testid={`chat-item-${index}`}
      onClick={handlePress}
    >
      <ChatCard user={user} chat={item} />
    </button>
  );
};

export default ChatItem;
