import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

import { GET_CHAT_BY_ID } from "../../../graphql/queries";
import ChatsMenu from "../ChatsMenu";

const Chat = ({ user, setActivePath }) => {
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  useEffect(() => {
    setActivePath("chats");
  });

  return (
    <div className="flex-grow flex">
      <ChatsMenu user={user} />
      <div className="flex-grow flex justify-center items-center">
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>Chat with id {match.chatId}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
