import helpers from "../../utils/helpers";
import ClickableImage from "../ClickableImage";

const NotificationMessage = ({ message }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-center">
      <div className="min-w-[100px] max-w-[300px] flex justify-center items-center pt-2 px-2 pb-1 bg-slate-300 rounded-lg">
        <div className="text-slate-800 text-sm text-center">{`${message.content}`}</div>
      </div>
    </div>
  );
};

const MessageByAnotherUser = ({ user, message }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-start">
      <div className="min-w-[100px] max-w-[600px] ml-8 pt-2 px-2 flex flex-col bg-slate-300 dark:bg-slate-500 rounded-lg relative">
        <div className="text-slate-800 dark:text-slate-100 font-bold">
          {message.sender.name}
        </div>
        {message.image.thumbnail && (
          <ClickableImage
            fullScreenImageUri={message.image.original}
            imageAlt="message-image"
            imageUri={message.image.thumbnail}
            className="w-[120px] h-[120px]"
          />
        )}
        {message.content && (
          <div
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className="text-slate-800 dark:text-slate-100"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-end text-xs text-slate-800 dark:text-slate-100">
          {helpers.formatMessageTime(
            message.createdAt,
            user.settings.time === "24h"
          )}
        </div>
        <div className="absolute bottom-0 -left-2 border-t-[16px] border-t-transparent border-r-[16px] border-r-slate-300 dark:border-r-slate-500"></div>
      </div>
      <img
        src={message.sender.image.thumbnail}
        alt="sender-thumbnail"
        className="relative right-[12px] w-12 h-12 rounded-full"
      />
    </div>
  );
};

const MessageByCurrentUser = ({ user, message }) => {
  return (
    <div className="mr-2 my-2 flex flex-col items-end">
      <div className="min-w-[100px] max-w-[600px] mr-8 pt-2 px-2 flex flex-col bg-green-300 rounded-lg relative">
        <div className="text-slate-800 font-bold">You</div>
        {message.image.thumbnail && (
          <ClickableImage
            fullScreenImageUri={message.image.original}
            imageAlt="message-image"
            imageUri={message.image.thumbnail}
            className="w-[120px] h-[120px]"
          />
        )}
        {message.content && (
          <div
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className="text-slate-800"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-xs text-slate-800 text-end">
          {helpers.formatMessageTime(
            message.createdAt,
            user.settings.time === "24h"
          )}
        </div>
        <div className="absolute bottom-0 -right-2 border-t-[16px] border-t-transparent border-l-[16px] border-l-green-300"></div>
      </div>
    </div>
  );
};

const Message = ({ user, message }) => {
  if (message.type === "notification") {
    return <NotificationMessage message={message} />;
  }

  return (
    <>
      {message.sender.id === user.id ? (
        <MessageByCurrentUser user={user} message={message} />
      ) : (
        <MessageByAnotherUser user={user} message={message} />
      )}
    </>
  );
};

export default Message;
