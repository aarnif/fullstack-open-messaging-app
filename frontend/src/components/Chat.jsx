import { useRef, useState, useEffect, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useMatch, useLocation, useNavigate } from "react-router";
import { AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { FaImage } from "react-icons/fa6";

import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";
import imageService from "../services/imageService";
import useModal from "../hooks/useModal";
import useField from "../hooks/useField";
import {
  FIND_CHAT_BY_ID,
  FIND_CHAT_BY_MEMBERS,
  CURRENT_USER,
} from "../graphql/queries";
import {
  MARK_CHAT_AS_READ,
  ADD_MESSAGE_TO_CHAT,
  CREATE_CHAT,
} from "../graphql/mutations";
import Loading from "./ui/Loading";
import GroupChatInfo from "./GroupChatInfo";
import Button from "./ui/Button";
import Title from "./ui/Title";
import Input from "./ui/Input";
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

export const ChatHeader = ({
  user,
  chat,
  setShowGroupChatInfo,
  isNewChat = false,
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/chats");
  };

  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
      setShowGroupChatInfo(true);
    } else {
      console.log("Clicked private chat info!");
      const anotherPrivateChatMember = chat.members.find(
        (member) => member.id !== user.id
      );
      navigate(`/contacts/${anotherPrivateChatMember.id}`);
    }
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
        disabled={isNewChat}
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

export const NewMessageInput = ({ user, chatId, newChatInfo }) => {
  const navigate = useNavigate();
  const { modal } = useModal();
  const message = useField("text", "New Message...");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const isNewChat = !chatId && newChatInfo;

  const [createChat] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors?.[0]?.message || error.message);
    },
  });

  const [addMessageToChat] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      modal("alert", "Notification", error.graphQLErrors[0].message);
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleCreateChat = async () => {
    if (!message.value && !base64Image) {
      console.log("Do not send empty message!");
      return;
    }

    try {
      const { data } = await createChat({
        variables: {
          title: newChatInfo.title ? newChatInfo.title : "",
          description: newChatInfo.description ? newChatInfo.description : "",
          memberIds: newChatInfo.members.map((member) => member.id),
          initialMessage: {
            type: "message",
            content: message.value,
          },
        },
        refetchQueries: [
          {
            query: FIND_CHAT_BY_MEMBERS,
            variables: {
              members: newChatInfo.members.map((member) => member.id),
            },
          },
        ],
      });

      if (data) {
        console.log("Created chat successfully");

        if (base64Image) {
          console.log("Uploading chat picture...");
          await imageService.uploadImage(data.createChat.id, base64Image);
        }

        navigate(`/chats/${data.createChat.id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
    }
  };

  const handleAddMessage = async () => {
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

      await addMessageToChat({
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

  const handleSubmit = isNewChat ? handleCreateChat : handleAddMessage;

  return (
    <NewMessageBox
      user={user}
      message={message}
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleSubmit}
    />
  );
};

const ImagePreview = ({ image, handleCancelImage }) => {
  return (
    <div className="relative p-4 w-full flex justify-center items-center bg-slate-50 dark:bg-slate-800">
      <img
        src={image}
        alt="message-image"
        className="max-h-40 w-auto object-contain"
      />
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          variant="close"
          testId="cancel-image-button"
          onClick={handleCancelImage}
        />
      </div>
    </div>
  );
};

export const NewMessageBox = ({
  user,
  message,
  image,
  setImage,
  setBase64Image,
  handleSubmit,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageImageRef = useRef(null);

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Image(base64String);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickAddImage = () => {
    messageImageRef.current.click();
  };

  const handleCancelImage = () => {
    setImage(null);
    setBase64Image(null);
    messageImageRef.current.value = null;
  };

  return (
    <>
      {image && (
        <ImagePreview image={image} handleCancelImage={handleCancelImage} />
      )}
      <div
        data-testid="emoji-picker"
        className="absolute bottom-[50px] right-4"
      >
        <EmojiPicker
          open={showEmojiPicker}
          onEmojiClick={(emoji) =>
            message.setValue((prev) => prev + emoji.emoji)
          }
          style={{
            backgroundColor:
              user.settings.theme === "dark" ? "#1e293b" : "#f1f5f9",
          }}
        />
      </div>
      <div className="px-4 w-full max-h-[50px] p-2 flex gap-2 bg-white dark:bg-slate-700 lg:shadow-lg">
        <button data-testid="add-image-button" onClick={handleClickAddImage}>
          <FaImage
            size={26}
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-green-600"
          />
          <input
            data-testid="image-input"
            ref={messageImageRef}
            hidden={true}
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="mt-2"
          />
        </button>

        <Input item={message} testId="new-message-input" />

        <Button
          type="button"
          variant="add-emoji-to-message"
          testId="show-emoji-picker-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <Button
          type="button"
          variant="send-new-message"
          testId="send-new-message-button"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

const ExistingChatContent = ({
  user,
  setActiveMenuItem,
  setActiveChatOrContactId,
}) => {
  const [showGroupChatInfo, setShowGroupChatInfo] = useState(false);
  const match = useMatch("/chats/:chatId").params;

  const { data, loading } = useQuery(FIND_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  const [mutateMarkChatAsRead] = useMutation(MARK_CHAT_AS_READ, {
    refetchQueries: [{ query: CURRENT_USER }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    setActiveMenuItem("chats");
    setActiveChatOrContactId(match.chatId);

    const markChatAsRead = async () => {
      console.log("Marking chat as read using new system");
      try {
        await mutateMarkChatAsRead({
          variables: { chatId: match.chatId },
        });
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    };

    markChatAsRead();
  }, [
    data,
    match.chatId,
    mutateMarkChatAsRead,
    setActiveChatOrContactId,
    setActiveMenuItem,
  ]);

  if (loading) {
    return <Loading />;
  }

  if (!data?.findChatById) {
    return <ChatNotFound />;
  }

  return (
    <>
      <ChatHeader
        user={user}
        chat={data.findChatById}
        setShowGroupChatInfo={setShowGroupChatInfo}
      />
      <Messages
        user={user}
        messages={[...(data?.findChatById.messages || [])].reverse()}
      />
      <NewMessageInput user={user} chatId={match.chatId} newChatInfo={null} />
      <AnimatePresence>
        {showGroupChatInfo && (
          <GroupChatInfo
            user={user}
            chat={data.findChatById}
            setShowGroupChatInfo={setShowGroupChatInfo}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const NewChatContent = ({ user, setActiveMenuItem, isNewChat }) => {
  const newChatInfo = JSON.parse(localStorage.getItem("new-chat-info"));

  useEffect(() => {
    setActiveMenuItem("chats");
  }, [setActiveMenuItem]);

  return (
    <>
      <ChatHeader
        user={user}
        chat={newChatInfo}
        setShowGroupChatInfoModal={null}
        isNewChat={isNewChat}
      />
      <Messages user={user} messages={[]} />
      <NewMessageInput user={user} chatId={null} newChatInfo={newChatInfo} />
    </>
  );
};

const Chat = ({
  user,
  setActiveMenuItem,
  setActiveChatOrContactId,
  menuComponent,
}) => {
  const location = useLocation();
  const isNewChat = location.pathname === "/chats/new";

  return (
    <div
      data-testid={isNewChat ? "new-chat-page" : "chat-page"}
      className="flex-grow flex"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="relative flex-grow flex flex-col justify-start items-start">
        {isNewChat ? (
          <NewChatContent
            user={user}
            setActiveMenuItem={setActiveMenuItem}
            isNewChat={isNewChat}
          />
        ) : (
          <ExistingChatContent
            user={user}
            setActiveMenuItem={setActiveMenuItem}
            setActiveChatOrContactId={setActiveChatOrContactId}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
