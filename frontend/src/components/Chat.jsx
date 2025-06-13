import { useRef, useState, useEffect, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useMatch } from "react-router";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

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
import Button from "./ui/Button";
import Title from "./ui/Title";

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
      className="relative w-full flex justify-center items-center p-2 bg-white dark:bg-slate-800 shadow-lg"
    >
      <div className="absolute left-2 flex justify-center items-center sm:hidden">
        <Button
          type="button"
          variant="return"
          testId="go-back-button"
          onClick={goBack}
        />
      </div>

      <button
        data-testid="chat-info-button"
        onClick={getInfo}
        className="flex justify-center items-center"
      >
        <div className="flex justify-center items-center gap-4">
          <img
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
            src={chat.image.thumbnail}
            alt="chat-thumbnail"
          />
          <div className="flex flex-col justify-center items-start">
            <Title variant="tertiary" testId="chat-title" text={chat.title} />

            {chat.isGroupChat && (
              <p className="text-sm text-slate-800 dark:text-slate-100">
                {chatMembersString}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

const NotificationMessage = ({ message }) => (
  <div
    data-testid="notification-message"
    className="flex flex-col items-center"
  >
    <p className="p-2 text-mobile sm:text-base text-slate-800 text-sm text-center bg-slate-300 rounded-lg">{`${message.content}`}</p>
  </div>
);

const MessageByAnotherUser = ({ user, message }) => (
  <div
    data-testid="message-by-another-user"
    className="flex flex-col items-start"
  >
    <div className="min-w-[100px] max-w-[250px] sm:max-w-[600px] ml-8 pt-2 px-2 flex flex-col bg-slate-300 dark:bg-slate-500 rounded-lg relative">
      <h3 className="text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold">
        {message.sender.name}
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
          className="text-sm sm:text-base text-slate-800 dark:text-slate-100 break-words"
        >
          {message.content}
        </p>
      )}
      <p className="my-1 text-end text-xs text-slate-800 dark:text-slate-100">
        {chatAndMessageHelpers.formatMessageTime(
          message.createdAt,
          user.settings.time === "24h"
        )}
      </p>
      <div className="absolute bottom-0 -left-2 border-t-[16px] border-t-transparent border-r-[16px] border-r-slate-300 dark:border-r-slate-500"></div>
    </div>
    <img
      src={message.sender.image.thumbnail}
      alt="sender-thumbnail"
      className="relative right-[12px] w-12 h-12 rounded-full"
    />
  </div>
);

const MessageByCurrentUser = ({ user, message }) => (
  <div
    data-testid="message-by-current-user"
    className="flex flex-col items-end"
  >
    <div className="relative min-w-[100px] max-w-[250px] sm:max-w-[600px] pt-2 px-2 flex flex-col bg-green-300 rounded-lg">
      <h3 className="text-mobile sm:text-base text-slate-800 font-bold">You</h3>
      {message.image.thumbnail && (
        <ClickableImage
          fullScreenImageUri={message.image.original}
          imageAlt="message-image"
          imageUri={message.image.thumbnail}
        />
      )}
      {message.content && (
        <p
          style={{
            marginTop: message.image.thumbnail ? 2 : 0,
            fontSize: message.type === "singleEmoji" ? 32 : "inherit",
            textAlign: message.type === "singleEmoji" ? "center" : "inherit",
          }}
          className="text-sm sm:text-base text-slate-800 break-words"
        >
          {message.content}
        </p>
      )}
      <p className="my-1 text-xs text-slate-800 text-end">
        {chatAndMessageHelpers.formatMessageTime(
          message.createdAt,
          user.settings.time === "24h"
        )}
      </p>
      <div className="absolute bottom-0 -right-2 border-t-[16px] border-t-transparent border-l-[16px] border-l-green-300"></div>
    </div>
  </div>
);

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
            <ChatHeader
              user={user}
              chat={data.findChatById}
              setShowGroupChatInfoModal={setShowGroupChatInfoModal}
            />
            <Messages
              user={user}
              messages={[...(data?.findChatById.messages || [])].reverse()}
            />
            <NewMessage user={user} chatId={match.chatId} />
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
