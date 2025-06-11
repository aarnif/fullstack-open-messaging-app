import { useNavigate } from "react-router";

import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";
import Title from "../ui/Title";

const LatestMessage = ({ user, latestMessage }) => {
  let messageContent = null;
  if (latestMessage.type === "notification") {
    messageContent = latestMessage.content;
  } else if (latestMessage.type === "singleImage") {
    messageContent =
      latestMessage.sender.id === user.id
        ? "You sent an image"
        : `${latestMessage.sender.name} sent an image`;
  } else {
    messageContent =
      latestMessage.sender.id === user.id
        ? `You: ${chatAndMessageHelpers.sliceLatestMessage(
            latestMessage.content
          )}`
        : `${
            latestMessage.sender.name
          }: ${chatAndMessageHelpers.sliceLatestMessage(
            latestMessage.content
          )}`;
  }

  return (
    <p
      data-testid="latest-chat-message"
      className="text-mobile lg:text-base text-slate-600 dark:text-slate-200"
    >
      {messageContent}
    </p>
  );
};

const ChatItem = ({
  user,
  chat,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const navigate = useNavigate();

  const handlePress = () => {
    console.log("Pressed chat titled:", chat.title);
    navigate(`/chats/${chat.id}`);
    setActiveChatOrContactId(chat.id);
  };

  if (!chat.messages.length) {
    return null;
  }

  const latestMessage = chat.messages[0];
  const newMessagesCount = chatAndMessageHelpers.newMessagesCount(
    user,
    chat.messages
  );

  const classStyles =
    activeChatOrContactId === chat.id
      ? "w-full py-2 px-4 flex items-start gap-4 border-b bg-slate-200 dark:bg-slate-700 transition"
      : "w-full py-2 px-4 flex items-start gap-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button
      id={activeChatOrContactId === chat.id ? "active-chat" : ""}
      className={classStyles}
      data-testid={`chat-item-${chat.id}`}
      onClick={handlePress}
    >
      <img
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
        src={chat.image.thumbnail}
        alt="Chat Thumbnail"
      />

      <div className="w-full flex flex-col" data-testid="chat-card">
        <div className="flex justify-between items-center">
          <Title
            variant="tertiary"
            testId={`chat-title-${chat.id}`}
            text={chat.title}
          />

          <p className="text-mobile lg:text-base text-slate-600 dark:text-slate-200">
            {chatAndMessageHelpers.formatMessageTime(
              latestMessage?.createdAt,
              user.settings.time === "24h"
            )}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <LatestMessage user={user} latestMessage={latestMessage} />
          {newMessagesCount > 0 && (
            <div
              style={{
                backgroundColor: newMessagesCount > 0 ? "#16a34a" : "white",
              }}
              className="w-[22px] h-[22px] flex justify-center items-center rounded-full"
            >
              <p
                data-testid="new-messages-count"
                className="flex justify-center items-center text-white font-semibold"
              >
                {newMessagesCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatItem;
