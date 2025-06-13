import { useRef, useState, useEffect, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useMatch } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";

import imageService from "../services/imageService";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";
import { FIND_CHAT_BY_ID } from "../graphql/queries";
import {
  MARK_MESSAGES_IN_CHAT_READ,
  ADD_MESSAGE_TO_CHAT,
} from "../graphql/mutations";
import useModal from "../hooks/useModal";
import useField from "../hooks/useField";
import Loading from "./ui/Loading";
import GroupChatInfoModal from "./Modals/GroupChatInfoModal";
import NewMessageBox from "./NewMessageBox";
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

export const ChatHeader = ({ user, chat, setShowGroupChatInfoModal }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/chats");
  };

  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
      const anotherPrivateChatMember = chat.members.find(
        (member) => member.id !== user.id
      );
      navigate(`/contacts/${anotherPrivateChatMember.id}`);
    }
    setShowGroupChatInfoModal(true);
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
    <div
      data-testid="chat-header"
      className="relative w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg"
    >
      <div className="absolute left-2 flex justify-center items-center sm:hidden">
        <button data-testid="go-back-button" onClick={goBack}>
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

const NotificationMessage = ({ message }) => {
  return (
    <div
      data-testid="notification-message"
      className="mr-2 my-2 flex flex-col items-center"
    >
      <div className="min-w-[100px] max-w-[300px] flex justify-center items-center pt-2 px-2 pb-1 bg-slate-300 rounded-lg">
        <div className="text-mobile sm:text-base text-slate-800 text-sm text-center">{`${message.content}`}</div>
      </div>
    </div>
  );
};

const MessageByAnotherUser = ({ user, message }) => {
  return (
    <div
      data-testid="message-by-another-user"
      className="mr-2 my-2 flex flex-col items-start"
    >
      <div className="min-w-[100px] max-w-[250px] sm:max-w-[600px] ml-8 pt-2 px-2 flex flex-col bg-slate-300 dark:bg-slate-500 rounded-lg relative">
        <div className="text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold">
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
            className="text-sm sm:text-base text-slate-800 dark:text-slate-100 break-words"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-end text-xs text-slate-800 dark:text-slate-100">
          {chatAndMessageHelpers.formatMessageTime(
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
    <div
      data-testid="message-by-current-user"
      className="mr-0 sm:mr-2 my-2 flex flex-col items-end"
    >
      <div className="min-w-[100px] max-w-[250px] sm:max-w-[600px] mr-4 sm:mr-8 pt-2 px-2 flex flex-col bg-green-300 rounded-lg relative">
        <div className="text-mobile sm:text-base text-slate-800 font-bold">
          You
        </div>
        {message.image.thumbnail && (
          <ClickableImage
            fullScreenImageUri={message.image.original}
            imageAlt="message-image"
            imageUri={message.image.thumbnail}
          />
        )}
        {message.content && (
          <div
            style={{
              marginTop: message.image.thumbnail ? 2 : 0,
              fontSize: message.type === "singleEmoji" ? 32 : "inherit",
              textAlign: message.type === "singleEmoji" ? "center" : "inherit",
            }}
            className="text-sm sm:text-base text-slate-800 break-words"
          >
            {message.content}
          </div>
        )}
        <div className="my-1 text-xs text-slate-800 text-end">
          {chatAndMessageHelpers.formatMessageTime(
            message.createdAt,
            user.settings.time === "24h"
          )}
        </div>
        <div className="absolute bottom-0 -right-2 border-t-[16px] border-t-transparent border-l-[16px] border-l-green-300"></div>
      </div>
    </div>
  );
};

export const Message = ({ user, message }) => {
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

export const Messages = ({ user, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div data-testid="chat-messages" className="h-full flex-grow flex flex-col">
      {!messages.length ? (
        <div
          data-testid="no-messages"
          className="w-full flex-grow flex justify-center items-center"
          key={"Empty item"}
        >
          <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold">
            Send a message to start the chat.
          </div>
        </div>
      ) : (
        <div className="w-full flex-grow py-4 sm:py-8 px-4 sm:px-16">
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

export const NewMessage = ({ user, chatId }) => {
  const { modal } = useModal();
  const message = useField("text", "New Message...");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [mutate] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      modal("alert", "Notification", error.graphQLErrors[0].message);
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSendMessage = async () => {
    console.log("Send message:", message.value);

    if (!message.value && !base64Image) {
      console.log("Do not send empty message!");
      return;
    }

    try {
      let result;

      if (base64Image) {
        console.log("Uploading chat picture...");
        result = await imageService.uploadImage(chatId, base64Image);
      }

      await mutate({
        variables: {
          chatId: chatId,
          content: message.value,
          input: {
            thumbnail: base64Image ? result.data.thumb.url : null,
            original: base64Image ? result.data.image.url : null,
          },
        },
      });
      message.onReset();
      setImage(null);
      setBase64Image(null);
    } catch (error) {
      console.log("Error creating new message:", error);
    }
  };

  return (
    <NewMessageBox
      user={user}
      message={message}
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleSendMessage}
    />
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
            <AnimatePresence>
              {showGroupChatInfoModal && (
                <GroupChatInfoModal
                  user={user}
                  chat={data.findChatById}
                  setShowGroupChatInfoModal={setShowGroupChatInfoModal}
                />
              )}
            </AnimatePresence>
            <ChatHeader
              user={user}
              chat={data.findChatById}
              setShowGroupChatInfoModal={setShowGroupChatInfoModal}
            />
            <div
              data-testid="chat-info"
              className="flex-grow w-full overflow-y-auto h-0"
            >
              <Messages
                user={user}
                messages={[...(data?.findChatById.messages || [])].reverse()}
              />
            </div>
            <NewMessage user={user} chatId={match.chatId} />
          </>
        ) : (
          <ChatNotFound />
        )}
      </div>
    </div>
  );
};

export default Chat;
