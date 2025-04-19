import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import { ALL_CHATS_BY_USER } from "../graphql/queries";
import {
  NEW_MESSAGE_TO_CHAT_ADDED,
  NEW_CHAT_CREATED,
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
      console.log("CHAT_DELETED-subscription error:", error);
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
      console.log("LEFT_GROUP_CHATS-subscription error:", error);
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data.allChatsByUser.length) {
    return (
      <div
        data-testid="no-chats-found"
        className="flex justify-start items-center"
      >
        <div className="mx-4 text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
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
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      ))}
    </div>
  );
};

const ChatsMenu = ({
  user,
  handleClickNewChat,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const searchWord = useField("text", "Search chats by title...");

  return (
    <div
      data-testid="chats-menu"
      className="flex-grow lg:max-w-[450px] flex flex-col bg-white dark:bg-slate-600"
    >
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        <MenuHeader
          title={"Chats"}
          handleCallBack={handleClickNewChat}
          searchWord={searchWord}
        />
        <ChatsList
          user={user}
          searchWord={searchWord}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      </div>
    </div>
  );
};

export default ChatsMenu;
