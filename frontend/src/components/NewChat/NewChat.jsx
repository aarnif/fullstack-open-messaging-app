import { useState, useEffect } from "react";

import NewChatHeader from "./NewChatHeader";
import Messages from "../Chat/Messages";
import NewChatAndFirstMessage from "./NewChatAndFirstMessage";

const NewChat = ({ user, setActiveMenuItem, menuComponent }) => {
  const [newChatInfo, setNewChatInfo] = useState(null);

  useEffect(() => {
    setActiveMenuItem("chats");
    setNewChatInfo(JSON.parse(localStorage.getItem("new-chat-info")));
  }, [setActiveMenuItem]);

  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex flex-col justify-start items-start bg-slate-50 dark:bg-slate-800">
        {!newChatInfo ? (
          <div>Loading...</div>
        ) : (
          <>
            <NewChatHeader user={user} chat={newChatInfo} />
            <div className="flex-grow w-full overflow-y-auto h-0">
              <Messages user={user} messages={[]} />
            </div>
            <NewChatAndFirstMessage user={user} newChatInfo={newChatInfo} />
          </>
        )}
      </div>
    </div>
  );
};

export default NewChat;
