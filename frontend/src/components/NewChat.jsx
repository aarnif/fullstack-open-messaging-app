import { useEffect } from "react";
import { Messages } from "./Chat";
import ChatHeader from "./ui/ChatHeader";
import NewMessageInput from "./ui/NewMessageInput";

const NewChat = ({ user, setActiveMenuItem, menuComponent }) => {
  const newChatInfo = JSON.parse(localStorage.getItem("new-chat-info"));

  useEffect(() => {
    setActiveMenuItem("chats");
  }, [setActiveMenuItem]);

  return (
    <div data-testid="new-chat-page" className="flex-grow flex">
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex flex-col justify-start items-start">
        <ChatHeader
          user={user}
          chat={newChatInfo}
          setShowGroupChatInfoModal={null}
        />
        <Messages user={user} messages={[]} />
        <NewMessageInput user={user} chatId={null} newChatInfo={newChatInfo} />
      </div>
    </div>
  );
};

export default NewChat;
