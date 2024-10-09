import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

import { GET_CHAT_BY_ID } from "../../../graphql/queries";
import ChatsMenu from "../ChatsMenu";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import NewMessage from "./NewMessage";

const Chat = ({ user, setActivePath }) => {
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  useEffect(() => {
    setActivePath("chats");
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Chat data:", data.findChatById.messages);

  const reverseMessages = [...data?.findChatById.messages].reverse();

  return (
    <div className="flex-grow flex">
      <ChatsMenu user={user} />
      <div className="flex-grow flex flex-col justify-start items-start">
        <ChatHeader user={user} chat={data.findChatById} />
        <div className="flex-grow w-full overflow-y-auto h-0">
          <Messages user={user} messages={reverseMessages} />
        </div>
        <NewMessage chatId={match.chatId} />
      </div>
    </div>
  );
};

export default Chat;
