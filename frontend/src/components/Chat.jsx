import { useRef, useState, useEffect, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useMatch } from "react-router";
import { AnimatePresence } from "framer-motion";

import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";
import { FIND_CHAT_BY_ID } from "../graphql/queries";
import { MARK_MESSAGES_IN_CHAT_READ } from "../graphql/mutations";
import Loading from "./ui/Loading";
import ChatHeader from "./ui/ChatHeader";
import NewMessageInput from "./ui/NewMessageInput";
import GroupChatInfoModal from "./Modals/GroupChatInfoModal";
import ClickableImage from "./ui/ClickableImage";

const ChatNotFound = () => (
  <div
    data-testid="chat-not-found"
    className="w-full flex-grow flex flex-col justify-center items-center"
  >
    <p className="text-xl text-red-600 font-bold">Chat not found!</p>
    <p className="text-xl text-red-600 font-bold">
      This could be due to wrong id or the chat was deleted.
    </p>
  </div>
);

const NotificationMessage = ({ message }) => (
  <div
    data-testid="notification-message"
    className="flex flex-col items-center"
  >
    <p className="p-2 text-mobile sm:text-base text-slate-800 text-sm text-center bg-slate-300 rounded-lg">{`${message.content}`}</p>
  </div>
);

const MessageBubble = ({ user, message, isCurrentUser }) => {
  const bubbleStyles = isCurrentUser
    ? "bg-green-300"
    : "bg-slate-300 dark:bg-slate-500 ml-8";

  const tailStyles = isCurrentUser
    ? "absolute bottom-0 -right-2 border-t-[16px] border-t-transparent border-l-[16px] border-l-green-300"
    : "absolute bottom-0 -left-2 border-t-[16px] border-t-transparent border-r-[16px] border-r-slate-300 dark:border-r-slate-500";

  const textColor = isCurrentUser
    ? "text-slate-800"
    : "text-slate-800 dark:text-slate-100";

  const senderName = isCurrentUser ? "You" : message.sender.name;

  return (
    <div
      data-testid={
        isCurrentUser ? "message-by-current-user" : "message-by-another-user"
      }
      className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`relative min-w-[100px] max-w-[250px] sm:max-w-[600px] pt-2 px-2 flex flex-col rounded-lg ${bubbleStyles}`}
      >
        <h3 className={`text-mobile sm:text-base font-bold ${textColor}`}>
          {senderName}
        </h3>

        {message.image.thumbnail && (
          <ClickableImage
            fullScreenImageUri={message.image.original}
            imageAlt="message-image"
            imageUri={message.image.thumbnail}
            className="w-[120px] h-[120px]"
          />
        )}

        {message.content && (
          <p
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className={`text-sm sm:text-base break-words ${textColor}`}
          >
            {message.content}
          </p>
        )}

        <p className={`my-1 text-end text-xs ${textColor}`}>
          {chatAndMessageHelpers.formatMessageTime(
            message.createdAt,
            user.settings.time === "24h"
          )}
        </p>

        <div className={tailStyles}></div>
      </div>

      {!isCurrentUser && (
        <img
          src={message.sender.image.thumbnail}
          alt="sender-thumbnail"
          className="relative right-[12px] w-12 h-12 rounded-full"
        />
      )}
    </div>
  );
};

export const Message = ({ user, message }) => {
  if (message.type === "notification") {
    return <NotificationMessage message={message} />;
  }

  const isCurrentUser = message.sender.id === user.id;

  return (
    <MessageBubble
      user={user}
      message={message}
      isCurrentUser={isCurrentUser}
    />
  );
};

export const Messages = ({ user, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      data-testid="chat-messages"
      className="py-4 px-8 h-0 flex-grow w-full flex flex-col gap-2 overflow-y-auto"
    >
      {messages.map((item, index) => {
        return (
          <Fragment key={item.id}>
            <Message user={user} message={item} index={index} />
            <div ref={messagesEndRef} />
          </Fragment>
        );
      })}
    </div>
  );
};

const Chat = ({
  user,
  setActiveMenuItem,
  setActiveChatOrContactId,
  menuComponent,
}) => {
  const [showGroupChatInfoModal, setShowGroupChatInfoModal] = useState(false);
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(FIND_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  const [mutateMarkMessagesInChatRead] = useMutation(
    MARK_MESSAGES_IN_CHAT_READ
  );

  useEffect(() => {
    setActiveMenuItem("chats");
    setActiveChatOrContactId(match.chatId);
    const markMessagesInChatRead = async () => {
      console.log("Marking messages in the active chat as read");
      mutateMarkMessagesInChatRead({
        variables: { chatId: match.chatId },
      });
    };
    markMessagesInChatRead();
  }, [
    data,
    match.chatId,
    mutateMarkMessagesInChatRead,
    setActiveChatOrContactId,
    setActiveMenuItem,
  ]);

  return (
    <div data-testid="chat-page" className="flex-grow flex">
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="relative flex-grow flex flex-col justify-start items-start">
        {loading ? (
          <Loading />
        ) : data?.findChatById ? (
          <>
            <ChatHeader
              user={user}
              chat={data.findChatById}
              setShowGroupChatInfoModal={setShowGroupChatInfoModal}
            />
            <Messages
              user={user}
              messages={[...(data?.findChatById.messages || [])].reverse()}
            />
            <NewMessageInput
              user={user}
              chatId={match.chatId}
              newChatInfo={null}
            />
          </>
        ) : (
          <ChatNotFound />
        )}
        <AnimatePresence>
          {showGroupChatInfoModal && (
            <GroupChatInfoModal
              user={user}
              chat={data.findChatById}
              setShowGroupChatInfoModal={setShowGroupChatInfoModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
