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

  console.log("Chat data:", data?.findChatById.messages);

  return (
    <div className="flex-grow flex">
      <ChatsMenu user={user} />
      <div className="flex-grow flex flex-col justify-start items-start">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <ChatHeader user={user} chat={data.findChatById} />
            <div className="flex-grow w-full overflow-y-auto h-0">
              <Messages
                user={user}
                messages={[...data?.findChatById.messages].reverse()}
              />
            </div>
            <NewMessage chatId={match.chatId} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
