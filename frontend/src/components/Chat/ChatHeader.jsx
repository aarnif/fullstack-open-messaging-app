import { useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";

import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

const ChatHeader = ({ user, chat, setShowChatInfoModal }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/chats");
  };

  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
    }
    setShowChatInfoModal(true);
  };

  const chatMembersString = chatAndMessageHelpers.sliceLatestMessage(
    chatAndMessageHelpers
      .sortChatMembersByNameAndUsername([...chat.members])
      .map((member) =>
        member.username === user.username ? "You" : member.name
      )
      .join(", "),
    30
  );

  return (
    <div className="relative w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg">
      <div className="absolute left-2 flex justify-center items-center sm:hidden">
        <button onClick={goBack}>
          <IoChevronBack className="w-6 h-6 lg:w-7 lg:h-7 text-slate-700 dark:text-slate-100 fill-current" />
        </button>
      </div>
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
                src={chat.image.thumbnail}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div
                data-testid="chat-title"
                className="text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold text-left"
              >
                {chat.title}
              </div>
              {chat.isGroupChat && (
                <div className="text-sm text-slate-800 dark:text-slate-100">
                  {chatMembersString}
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
