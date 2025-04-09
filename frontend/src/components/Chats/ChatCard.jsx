import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

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
    <div
      data-testid="latest-chat-message"
      className="text-mobile lg:text-base w-full text-slate-600 dark:text-slate-200 text-left"
    >
      {messageContent}
    </div>
  );
};

const ChatCard = ({ user, chat }) => {
  const latestMessage = chat.messages[0];
  const newMessagesCount = chatAndMessageHelpers.newMessagesCount(
    user,
    chat.messages
  );

  return (
    <>
      <div data-testid="chat-card" className="mr-4">
        <img
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
          src={chat.image.thumbnail}
          alt="Chat Thumbnail"
        />
      </div>
      <div className="flex-1 flex-col">
        <div className="flex justify-start items-center text-mobile lg:text-base">
          <div className="flex-grow font-bold text-slate-800 dark:text-slate-100 text-left">
            {chat.title}
          </div>

          <div className="flex justify-center items-center text-slate-600 dark:text-slate-200">
            {chatAndMessageHelpers.formatMessageTime(
              latestMessage?.createdAt,
              user.settings.time === "24h"
            )}
          </div>
        </div>
        <div className="flex justify-start items-center">
          <LatestMessage user={user} latestMessage={latestMessage} />
          {newMessagesCount > 0 && (
            <div className="flex-grow flex justify-center items-center">
              <div
                style={{
                  backgroundColor: newMessagesCount > 0 ? "#16a34a" : "white",
                }}
                className="w-[22px] h-[22px] flex justify-center items-center rounded-full"
              >
                <div
                  data-testid="new-messages-count"
                  className="flex justify-center items-center text-white font-semibold"
                >
                  {newMessagesCount}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatCard;
