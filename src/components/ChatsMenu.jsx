import { useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_CHATS_BY_USER } from "../../graphql/queries";
import useField from "../../hooks/useField";
import SearchBar from "./SearchBar";
import ChatItem from "./Chats/ChatItem";

const Header = ({ searchWord }) => {
  return (
    <div className="p-4">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl text-slate-800 font-bold">Chats</h1>
      </div>

      <SearchBar searchWord={searchWord} />
    </div>
  );
};

const ChatsList = ({ user, searchWord }) => {
  const [activePath, setActivePath] = useState(null);
  const { data, loading } = useQuery(GET_CHATS_BY_USER, {
    variables: {
      searchByTitle: searchWord.value,
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
  const searchWord = useField("text", "Enter your username here...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white">
      <Header searchWord={searchWord} />
      <ChatsList user={user} searchWord={searchWord} />
    </div>
  );
};

export default ChatsMenu;
