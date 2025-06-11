import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// import NewChatHeader from "./NewChatHeader";
import Messages from "../Chat/Messages";
import NewChatAndFirstMessage from "./NewChatAndFirstMessage";

export const NewChatHeader = ({ user, chat }) => {
  const navigate = useNavigate();
  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
      const anotherChatMember = chat.members.find(
        (member) => member.username !== user.username
      );
      navigate(`/contacts/${anotherChatMember.id}`);
    }
  };

  const chatMembersString = chat.members
    .map((member) => (member.username === user.username ? "You" : member.name))
    .join(", ");

  return (
    <div
      data-testid="new-chat-header"
      className="w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg"
    >
      <div className="flex">
        <button
          data-testid="chat-info-button"
          onClick={getInfo}
          className="flex-grow"
        >
          <div className="flex justify-center items-center">
            <div className="mr-4">
              <img
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                src={chat.image}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div
                data-testid="new-chat-title"
                className="text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold text-left"
              >
                {chat.title}
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {chatMembersString}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

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
