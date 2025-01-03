import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import { ALL_CHATS_BY_USER } from "../graphql/queries";
import {
  NEW_MESSAGE_ADDED,
  NEW_CHAT_ADDED,
  CHAT_DELETED,
  LEFT_GROUP_CHATS,
} from "../graphql/subscriptions";
import useField from "../hooks/useField";
import Loading from "./Loading";
import ChatItem from "./Chats/ChatItem";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";
import MenuHeader from "./MenuHeader";

const ChatsList = ({
  user,
  searchWord,
  activeChatOrContact,
  setActiveChatOrContact,
}) => {
  const client = useApolloClient();
  const { data, loading } = useQuery(ALL_CHATS_BY_USER, {
    variables: {
      searchByTitle: searchWord.value,
    },
  });

  useSubscription(NEW_MESSAGE_ADDED, {
    onData: ({ data }) => {
      console.log("Use NEW_MESSAGE_ADDED-subscription:");
      const updatedChat = data.data.messageToChatAdded;
      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          const sortedChats = chatAndMessageHelpers.sortChatsByDate(
            allChatsByUser.map((chat) => {
              return chat.id === updatedChat.id ? { ...updatedChat } : chat;
            })
          );
          return {
            allChatsByUser: sortedChats,
          };
        }
      );
    },
    onError: (error) => {
      console.log("New message added error:", error);
    },
  });

  useSubscription(NEW_CHAT_ADDED, {
    onData: ({ data }) => {
      console.log("Use NEW_CHAT_ADDED-subscription:");
      const newChat = data.data.chatAdded;
      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          const sortedChats = chatAndMessageHelpers.sortChatsByDate(
            allChatsByUser.concat(newChat)
          );
          return {
            allChatsByUser: sortedChats,
          };
        }
      );
    },
    onError: (error) => {
      console.log("New chat added error:", error);
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
          variables: {
            searchByTitle: "",
          },
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
      console.log("Chat deleted error:", error);
    },
  });

  useSubscription(LEFT_GROUP_CHATS, {
    onData: ({ data }) => {
      console.log("Use LEFT_GROUP_CHATS-subscription:");
      const leftGroupChatData = data.data.leftGroupChats;
      console.log("Left group chats:", leftGroupChatData);
      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
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
          return {
            allChatsByUser: allChatsByUser,
          };
        }
      );
    },
    onError: (error) => {
      console.log("Left group chats error:", error);
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data.allChatsByUser.length) {
    return (
      <div className="flex justify-start items-center">
        <div className="mx-4 text-2xl font-bold text-slate-800 dark:text-white">
          No chats found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {data.allChatsByUser.map((item, index) => (
        <ChatItem
          key={item.id}
          index={index}
          user={user}
          item={item}
          activeChatOrContact={activeChatOrContact}
          setActiveChatOrContact={setActiveChatOrContact}
        />
      ))}
    </div>
  );
};

const ChatsMenu = ({
  user,
  handleClickNewChat,
  activeChatOrContact,
  setActiveChatOrContact,
}) => {
  const searchWord = useField("text", "Search chats by title...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white dark:bg-slate-600">
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        <MenuHeader
          title={"Chats"}
          handleCallBack={handleClickNewChat}
          searchWord={searchWord}
        />
        <ChatsList
          user={user}
          searchWord={searchWord}
          activeChatOrContact={activeChatOrContact}
          setActiveChatOrContact={setActiveChatOrContact}
        />
      </div>
    </div>
  );
};

export default ChatsMenu;
