import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

const ChatHeader = ({ user, chat, setShowChatInfoModal }) => {
  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
    }
    setShowChatInfoModal(true);
  };

  const chatMembersString = chatAndMessageHelpers
    .sortChatMembersByNameAndUsername([...chat.members])
    .map((member) => (member.username === user.username ? "You" : member.name))
    .join(", ");

  return (
    <div className="w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg">
      <div className="flex">
        <button
          data-testid="chat-info-button"
          onClick={getInfo}
          className="flex-grow"
        >
          <div className="flex justify-center items-center">
            <div className="mr-4">
              <img
                className="w-16 h-16 rounded-full"
                src={chat.image.thumbnail}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div
                data-testid="chat-title"
                className="text-base text-slate-800 dark:text-slate-100 font-bold text-left"
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
