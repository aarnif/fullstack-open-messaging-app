import helpers from "../../utils/helpers";

const LatestMessage = ({ user, latestMessage }) => {
  if (latestMessage.type === "notification") {
    return (
      <div className="w-full text-gray-600 text-left">
        {latestMessage.content}
      </div>
    );
  }

  return (
    <div className="w-full text-gray-600 text-left">
      {latestMessage.sender.id === user.id
        ? "You:"
        : `${latestMessage.sender.name}:`}{" "}
      {helpers.sliceLatestMessage(latestMessage.content)}
    </div>
  );
};

const ChatCard = ({ user, chat }) => {
  const latestMessage = chat.messages[0];
  const newMessagesCount = helpers.newMessagesCount(user, chat.messages);

  return (
    <>
      <div className="mr-4">
        <img
          className="w-16 h-16 rounded-full"
          src={chat.displayChatImage.thumbnail}
          alt="Chat Thumbnail"
        />
      </div>
      <div className="flex-1 flex-col">
        <div className="flex justify-start items-center">
          <div className="flex-grow text-md font-bold text-left">
            {chat.displayChatTitle}
          </div>

          <div className="flex justify-center items-center text-gray-600">
            {helpers.formatMessageTime(
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
                className="mt-1 w-[20px] h-[20px] flex justify-center items-center rounded-full"
              >
                <p className="text-white font-semibold">{newMessagesCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatCard;
