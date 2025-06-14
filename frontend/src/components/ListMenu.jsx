import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { FaSearch } from "react-icons/fa";

import { ALL_CHATS_BY_USER, ALL_CONTACTS_BY_USER } from "../graphql/queries";
import {
  NEW_MESSAGE_TO_CHAT_ADDED,
  NEW_CHAT_CREATED,
  CHAT_DELETED,
  LEFT_GROUP_CHATS,
} from "../graphql/subscriptions";
import useField from "../hooks/useField";
import Loading from "./ui/Loading";
import Title from "./ui/Title";
import Button from "./ui/Button";
import Input from "./ui/Input";
import ChatItem from "./Chats/ChatItem";
import ContactItem from "./Contacts/ContactItem";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";

const EmptyState = ({ message, testId }) => (
  <div data-testid={testId} className="flex justify-start items-center">
    <p className="mx-4 text-xl font-bold text-slate-800 dark:text-white">
      {message}
    </p>
  </div>
);

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
            allChatsByUser.map((chat) => {
              return chat.id === updatedChat.id ? { ...updatedChat } : chat;
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
          const sortedChats = chatAndMessageHelpers.sortChatsByDate(
            allChatsByUser.concat(newChat)
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
              (chat) => chat.id !== deletedChatId
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
                  (chat) => !leftGroupChatData.chatIds.includes(chat.id)
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

  const chats = data?.allChatsByUser || [];

  if (!chats.length) {
    return <EmptyState message="No chats found" testId="no-chats-found" />;
  }

  return (
    <div className="w-full">
      {chats.map((chat, index) => (
        <ChatItem
          key={chat.id}
          index={index}
          user={user}
          chat={chat}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      ))}
    </div>
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
