import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import { GET_CHATS_BY_USER } from "../../graphql/queries";
import { NEW_MESSAGE_ADDED } from "../../graphql/subscriptions";
import useField from "../../hooks/useField";
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
          4;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.allChatsByUser.length) {
    return (
      <div className="flex justify-start items-center">
        <p className="mt-4 text-2xl font-bold text-slate-700">No chats found</p>
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

const ChatsMenu = ({ user }) => {
  const searchWord = useField("text", "Search chats by title...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white">
      <MenuHeader
        title={"Chats"}
        handleCallBack={() => console.log("Clicked new chat")}
        searchWord={searchWord}
      />
      <ChatsList user={user} searchWord={searchWord} />
    </div>
  );
};

export default ChatsMenu;
