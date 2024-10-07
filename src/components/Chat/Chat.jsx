import { GET_CHAT_BY_ID } from "../../../graphql/queries";
import ChatsMenu from "../ChatsMenu";

import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

const Chat = ({ user }) => {
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
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
