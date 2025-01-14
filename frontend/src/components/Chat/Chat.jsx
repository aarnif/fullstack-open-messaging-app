import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useMatch } from "react-router";
import { AnimatePresence } from "framer-motion";

import { FIND_CHAT_BY_ID } from "../../graphql/queries";
import { MARK_MESSAGES_IN_CHAT_READ } from "../../graphql/mutations";
import Loading from "../Loading";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import NewMessage from "./NewMessage";
import GroupChatInfoModal from "../Modals/GroupChatInfoModal/GroupChatInfoModal";
import PrivateChatInfoModal from "../Modals/PrivateChatInfoModal/PrivateChatInfoModal";

const ChatNotFound = () => (
  <div className="flex-grow w-full overflow-y-auto h-0 flex flex-col justify-center items-center">
    <div className="text-xl text-red-600 font-bold">Chat not found!</div>
    <div className="text-xl text-red-600 font-bold">
      This could be due to wrong id or the chat was deleted.
    </div>
  </div>
);

const Chat = ({
  user,
  setActiveMenuItem,
  setActiveChatOrContactId,
  menuComponent,
}) => {
  const [showChatInfoModal, setShowChatInfoModal] = useState(false);
  const match = useMatch("/chats/:chatId").params;
  const { data, loading } = useQuery(FIND_CHAT_BY_ID, {
    variables: {
      chatId: match.chatId,
    },
  });

  const [mutateMarkMessagesInChatRead] = useMutation(
    MARK_MESSAGES_IN_CHAT_READ,
    {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message);
      },
    }
  );

  useEffect(() => {
    setActiveMenuItem("chats");
    setActiveChatOrContactId(match.chatId);
    const markMessagesInChatRead = async () => {
      console.log("Marking messages in the active chat as read");
      mutateMarkMessagesInChatRead({
        variables: { chatId: match.chatId },
      });
    };
    markMessagesInChatRead();
  }, [
    data,
    match.chatId,
    mutateMarkMessagesInChatRead,
    setActiveChatOrContactId,
    setActiveMenuItem,
  ]);

  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="relative flex-grow flex flex-col justify-start items-start bg-slate-50 dark:bg-slate-800">
        {loading ? (
          <Loading />
        ) : data?.findChatById ? (
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
                messages={[...(data?.findChatById.messages || [])].reverse()}
              />
            </div>
            <NewMessage user={user} chatId={match.chatId} />
          </>
        ) : (
          <ChatNotFound />
        )}
      </div>
    </div>
  );
};

export default Chat;
