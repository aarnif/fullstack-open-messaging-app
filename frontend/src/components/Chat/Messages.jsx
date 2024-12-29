import { useRef, useEffect, Fragment } from "react";
import Message from "./Message";
import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

const Messages = ({ user, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const newMessagesCount = chatAndMessageHelpers.newMessagesCount(
    user,
    messages
  );

  console.log("New messages count:", newMessagesCount);
  return (
    <div className="h-full flex-grow flex flex-col">
      {!messages.length ? (
        <div
          className="w-full flex-grow flex justify-center items-center"
          key={"Empty item"}
        >
          <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold">
            Send a message to start the chat.
          </div>
        </div>
      ) : (
        <div className="w-full flex-grow py-8 px-16">
          {messages.map((item, index) => {
            return (
              <Fragment key={item.id}>
                <Message user={user} message={item} index={index} />
                <div ref={messagesEndRef} />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
