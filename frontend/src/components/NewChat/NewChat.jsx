import { useState, useEffect } from "react";

import NewChatHeader from "./NewChatHeader";
import Messages from "../Chat/Messages";
import NewChatAndFirstMessage from "./NewChatAndFirstMessage";

const NewChat = ({ user, setActiveMenuItem, menuComponent }) => {
  const [newChatInfo, setNewChatInfo] = useState(
    JSON.parse(localStorage.getItem("new-chat-info"))
  );

  useEffect(() => {
    setActiveMenuItem("chats");
  }, [setActiveMenuItem]);

  return (
    <div data-testid="new-chat-page" className="flex-grow flex">
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex flex-col justify-start items-start">
        <NewChatHeader user={user} chat={newChatInfo} />
        <div className="flex-grow w-full overflow-y-auto h-0">
          <Messages user={user} messages={[]} />
        </div>
        <NewChatAndFirstMessage user={user} newChatInfo={newChatInfo} />
      </div>
    </div>
  );
};

export default NewChat;
