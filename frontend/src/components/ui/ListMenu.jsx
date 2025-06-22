import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";

import { ALL_CHATS_BY_USER, ALL_CONTACTS_BY_USER } from "../../graphql/queries";
import {
  NEW_MESSAGE_TO_CHAT_ADDED,
  NEW_CHAT_CREATED,
  CHAT_DELETED,
  LEFT_GROUP_CHATS,
} from "../../graphql/subscriptions";
import useField from "../../hooks/useField";
import Loading from "./Loading";
import Title from "./Title";
import Button from "./Button";
import Input from "./Input";
import ContactCard from "./ContactCard";
import chatAndMessageHelpers from "../../helpers/chatAndMessageHelpers";

const EmptyState = ({ message, testId }) => (
  <div data-testid={testId} className="flex justify-start items-center">
    <p className="mx-4 text-xl font-bold text-slate-800 dark:text-white">
      {message}
    </p>
  </div>
);

const LatestMessage = ({ user, latestMessage }) => {
  const isCurrentUser = latestMessage.sender.id === user.id;
  const senderName = latestMessage.sender.name;

  const getMessageContent = () => {
    switch (latestMessage.type) {
      case "notification":
        return latestMessage.content;

      case "singleImage":
        return isCurrentUser
          ? "You sent an image"
          : `${senderName} sent an image`;

      default: {
        const content = chatAndMessageHelpers.sliceLatestMessage(
          latestMessage.content
        );
        return isCurrentUser ? `You: ${content}` : `${senderName}: ${content}`;
      }
    }
  };

  return (
    <p
      data-testid="latest-chat-message"
      className="text-mobile lg:text-base text-slate-600 dark:text-slate-200"
    >
      {getMessageContent()}
    </p>
  );
};

export const ChatItem = ({
  user,
  userChat,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const navigate = useNavigate();
  const { chat, unreadMessages } = userChat;

  const handlePress = () => {
    console.log("Pressed chat titled:", chat.title);
    navigate(`/chats/${chat.id}`);
    setActiveChatOrContactId(chat.id);
  };

  if (!chat.messages.length) {
    return null;
  }

  const latestMessage = chat.messages[chat.messages.length - 1];
  const isActiveChat = activeChatOrContactId === chat.id;
  const hasNewMessages = unreadMessages > 0;

  const classStyles = isActiveChat
    ? "w-full py-2 px-4 flex items-start gap-4 border-b bg-slate-200 dark:bg-slate-700 transition"
    : "w-full py-2 px-4 flex items-start gap-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button
      id={isActiveChat ? "active-chat" : ""}
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
          {hasNewMessages && (
            <div
              style={{
                backgroundColor: hasNewMessages ? "#16a34a" : "white",
              }}
              className="w-[22px] h-[22px] flex justify-center items-center rounded-full"
            >
              <p
                data-testid="new-messages-count"
                className="flex justify-center items-center text-white font-semibold"
              >
                {unreadMessages}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const ChatsList = ({
  user,
  searchWord,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const client = useApolloClient();

  const { data, loading } = useQuery(ALL_CHATS_BY_USER, {
    variables: {
      searchByTitle: searchWord.value,
    },
  });

  useSubscription(NEW_MESSAGE_TO_CHAT_ADDED, {
    onData: ({ data }) => {
      console.log("Use NEW_MESSAGE_TO_CHAT_ADDED-subscription:");
      const updatedChat = data.data.messageToChatAdded;

      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: { searchByTitle: "" },
        },
        ({ allChatsByUser }) => {
          const sortedChats = chatAndMessageHelpers.sortChatsByDate(
            allChatsByUser.map((userChat) => {
              if (userChat.chat.id === updatedChat.id) {
                const isActiveChat = activeChatOrContactId === updatedChat.id;
                return {
                  ...userChat,
                  chat: updatedChat,
                  unreadMessages: isActiveChat
                    ? 0
                    : userChat.unreadMessages + 1,
                };
              }
              return userChat;
            })
          );
          return { allChatsByUser: sortedChats };
        }
      );
    },
    onError: (error) => {
      console.log("NEW_MESSAGE_TO_CHAT_ADDED-subscription error:", error);
    },
  });

  useSubscription(NEW_CHAT_CREATED, {
    onData: ({ data }) => {
      console.log("Use NEW_CHAT_CREATED-subscription:");
      const newChat = data.data.newChatCreated;

      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: { searchByTitle: "" },
        },
        ({ allChatsByUser }) => {
          const newUserChat = {
            __typename: "UserChat",
            chat: {
              __typename: "Chat",
              id: newChat.id,
              title: newChat.title,
              isGroupChat: newChat.isGroupChat,
              image: {
                thumbnail: newChat.image.thumbnail,
                original: newChat.image.original,
              },
              messages: newChat.messages,
            },
            unreadMessages: 0,
            lastReadMessageId: null,
            lastReadAt: null,
          };
          const sortedChats = chatAndMessageHelpers.sortChatsByDate(
            allChatsByUser.concat(newUserChat)
          );
          return { allChatsByUser: sortedChats };
        }
      );
    },
    onError: (error) => {
      console.log("NEW_CHAT_CREATED-subscription error:", error);
    },
  });

  useSubscription(CHAT_DELETED, {
    onData: ({ data }) => {
      console.log("Use CHAT_DELETED-subscription:");
      const deletedChatId = data.data.chatDeleted;

      client.cache.evict({
        id: client.cache.identify({ __typename: "Chat", id: deletedChatId }),
      });

      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: { searchByTitle: "" },
        },
        ({ allChatsByUser }) => {
          return {
            allChatsByUser: allChatsByUser.filter(
              (userChat) => userChat.chat.id !== deletedChatId
            ),
          };
        }
      );
    },
    onError: (error) => {
      console.log("CHAT_DELETED-subscription error:", error);
    },
  });

  useSubscription(LEFT_GROUP_CHATS, {
    onData: ({ data }) => {
      console.log("Use LEFT_GROUP_CHATS-subscription:");
      const leftGroupChatData = data.data.leftGroupChats;

      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: { searchByTitle: "" },
        },
        ({ allChatsByUser }) => {
          if (leftGroupChatData.memberId === user.id) {
            console.log("User left group chat");
            return {
              allChatsByUser: chatAndMessageHelpers.sortChatsByDate(
                allChatsByUser.filter(
                  (userChat) =>
                    !leftGroupChatData.chatIds.includes(userChat.chat.id)
                )
              ),
            };
          }
          return { allChatsByUser: allChatsByUser };
        }
      );
    },
    onError: (error) => {
      console.log("LEFT_GROUP_CHATS-subscription error:", error);
    },
  });

  if (loading) {
    return <Loading />;
  }

  const userChats = data?.allChatsByUser || [];

  if (!userChats.length) {
    return <EmptyState message="No chats found" testId="no-chats-found" />;
  }

  return (
    <div className="w-full">
      {userChats.map((userChat, index) => (
        <ChatItem
          key={userChat.chat.id}
          index={index}
          user={user}
          userChat={userChat}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      ))}
    </div>
  );
};

export const ContactItem = ({
  user,
  item,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Pressed contact named:", item.name);
    navigate(`/contacts/${item.id}`);
    setActiveChatOrContactId(item.id);
  };

  const classStyles =
    activeChatOrContactId === item.id
      ? "w-full flex items-start py-2 px-4 border-b bg-slate-200 dark:bg-slate-700 transition"
      : "w-full flex items-start py-2 px-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button
      id={activeChatOrContactId === item.id ? "active-contact" : ""}
      data-testid={item.username}
      className={classStyles}
      onClick={handleClick}
    >
      <ContactCard user={user} item={item} />
    </button>
  );
};

const ContactsList = ({
  user,
  searchWord,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const { data, loading } = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  if (loading) {
    return <Loading />;
  }

  const contacts = data?.allContactsByUser?.contacts || [];

  if (!contacts.length) {
    return (
      <EmptyState message="No contacts found" testId="no-contacts-found" />
    );
  }

  return (
    <div className="w-full">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          user={user}
          item={contact}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      ))}
    </div>
  );
};

export const MenuHeader = ({ title, handleCallBack, searchWord }) => {
  return (
    <div data-testid="menu-header" className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Title variant="primary" testId="menu-header-title" text={title} />
        <Button
          type="button"
          variant="new-chat"
          testId={title === "Chats" ? "new-chat-button" : "new-contact-button"}
          onClick={handleCallBack}
        />
      </div>

      <Input
        item={searchWord}
        testId={
          title === "Contacts" ? "contact-search-input" : "chat-search-input"
        }
        icon={
          <FaSearch className="w-4 h-4 text-slate-800 dark:text-slate-100 fill-current" />
        }
      />
    </div>
  );
};

const ListMenu = ({
  user,
  menuType,
  handleClickCallback,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const isChatsMenu = menuType === "chats";

  const searchPlaceholder = isChatsMenu
    ? "Search chats by title..."
    : "Search contacts by name or username...";

  const searchWord = useField("text", searchPlaceholder);
  const title = isChatsMenu ? "Chats" : "Contacts";
  const testId = isChatsMenu ? "chats-menu" : "contacts-menu";

  return (
    <div
      data-testid={testId}
      className="flex-grow lg:max-w-[450px] flex flex-col bg-white dark:bg-slate-600"
    >
      <MenuHeader
        title={title}
        handleCallBack={handleClickCallback}
        searchWord={searchWord}
      />
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        {isChatsMenu ? (
          <ChatsList
            user={user}
            searchWord={searchWord}
            activeChatOrContactId={activeChatOrContactId}
            setActiveChatOrContactId={setActiveChatOrContactId}
          />
        ) : (
          <ContactsList
            user={user}
            searchWord={searchWord}
            activeChatOrContactId={activeChatOrContactId}
            setActiveChatOrContactId={setActiveChatOrContactId}
          />
        )}
      </div>
    </div>
  );
};

export default ListMenu;
