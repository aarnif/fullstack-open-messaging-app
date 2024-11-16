import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { GET_CHAT_BY_ID } from "../../graphql/queries";
import Loading from "../Loading";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import NewMessage from "./NewMessage";
import GroupChatInfoModal from "../Modals/GroupChatInfoModal/GroupChatInfoModal";
import PrivateChatInfoModal from "../Modals/PrivateChatInfoModal/PrivateChatInfoModal";

const Chat = ({ user, setActivePath, menuComponent }) => {
  const [showChatInfoModal, setShowChatInfoModal] = useState(false);
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(GET_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  useEffect(() => {
    setActivePath("chats");
  }, []);

  let renderComponent = (
    <div className="flex-grow w-full overflow-y-auto h-0 flex flex-col justify-center items-center">
      <div className="text-xl text-red-600 font-bold">Chat not found!</div>
      <div className="text-xl text-red-600 font-bold">
        This could be due to wrong id or the chat was deleted.
      </div>
    </div>
  );

  if (loading) {
    renderComponent = <Loading />;
  }

  if (data?.findChatById) {
    renderComponent = (
      <>
        <AnimatePresence>
          {showChatInfoModal &&
            (data.findChatById.isGroupChat ? (
              <GroupChatInfoModal
                user={user}
                chat={data.findChatById}
                setShowChatInfoModal={setShowChatInfoModal}
              />
            ) : (
              <PrivateChatInfoModal
                user={user}
                chat={data.findChatById}
                setShowChatInfoModal={setShowChatInfoModal}
              />
            ))}
        </AnimatePresence>
        <ChatHeader
          user={user}
          chat={data.findChatById}
          setShowChatInfoModal={setShowChatInfoModal}
        />
        <div className="flex-grow w-full overflow-y-auto h-0">
          <Messages
            user={user}
            messages={[...data?.findChatById.messages].reverse()}
          />
        </div>
        <NewMessage user={user} chatId={match.chatId} />
      </>
    );
  }

  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="relative flex-grow flex flex-col justify-start items-start bg-slate-50 dark:bg-slate-800">
        {renderComponent}
      </div>
    </div>
  );
};

export default Chat;
