import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import { GET_CHATS_BY_USER } from "../graphql/queries";
import {
  NEW_MESSAGE_ADDED,
  NEW_CHAT_ADDED,
  CHAT_EDITED,
  CHAT_DELETED,
  LEFT_GROUP_CHATS,
} from "../graphql/subscriptions";
import useField from "../hooks/useField";
import Loading from "./Loading";
import ChatItem from "./Chats/ChatItem";
import helpers from "../utils/helpers";
import MenuHeader from "./MenuHeader";

const ChatsList = ({ user, searchWord }) => {
  const client = useApolloClient();
  const [activePath, setActivePath] = useState(null);
  const { data, loading } = useQuery(GET_CHATS_BY_USER, {
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
          query: GET_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          const sortedChats = helpers.sortChatsByDate(
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
  });

  useSubscription(NEW_CHAT_ADDED, {
    onData: ({ data }) => {
      console.log("Use NEW_CHAT_ADDED-subscription:");
      const newChat = data.data.chatAdded;
      client.cache.updateQuery(
        {
          query: GET_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          const sortedChats = helpers.sortChatsByDate(
            allChatsByUser.concat(newChat)
          );
          return {
            allChatsByUser: sortedChats,
          };
        }
      );
    },
  });

  useSubscription(CHAT_EDITED, {
    onData: ({ data }) => {
      console.log("Use CHAT_EDITED-subscription:");
      const updatedChat = data.data.groupChatUpdated;
      client.cache.updateQuery(
        {
          query: GET_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          const sortedChats = helpers.sortChatsByDate(
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
          query: GET_CHATS_BY_USER,
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
  });

  useSubscription(LEFT_GROUP_CHATS, {
    onData: ({ data }) => {
      console.log("Use LEFT_GROUP_CHATS-subscription:");
      const leftGroupChatData = data.data.leftGroupChats;
      console.log("Left group chats:", leftGroupChatData);
      client.cache.updateQuery(
        {
          query: GET_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          if (leftGroupChatData.member === user.id) {
            return {
              allChatsByUser: helpers.sortChatsByDate(
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
      {data.allChatsByUser.map((item) => (
        <ChatItem
          key={item.id}
          user={user}
          item={item}
          activePath={activePath}
          setActivePath={setActivePath}
        />
      ))}
    </div>
  );
};

const ChatsMenu = ({ user, handleClickNewChat }) => {
  const searchWord = useField("text", "Search chats by title...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white dark:bg-slate-600">
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        <MenuHeader
          title={"Chats"}
          handleCallBack={handleClickNewChat}
          searchWord={searchWord}
        />
        <ChatsList user={user} searchWord={searchWord} />
      </div>
    </div>
  );
};

export default ChatsMenu;
