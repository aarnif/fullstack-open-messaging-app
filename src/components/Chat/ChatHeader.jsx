import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { MARK_MESSAGES_IN_CHAT_READ } from "../../../graphql/mutations";

const ChatHeader = ({ user, chat }) => {
  const navigate = useNavigate();
  const [mutateMarkMessagesInChatRead] = useMutation(
    MARK_MESSAGES_IN_CHAT_READ,
    {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message);
      },
    }
  );

  useEffect(() => {
    mutateMarkMessagesInChatRead({
      variables: { chatId: chat.id },
    });
  });

  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
      const anotherChatParticipant = chat.participants.find(
        (participant) => participant.username !== user.username
      );
      navigate(`/contacts/${anotherChatParticipant.id}`);
    }
  };

  const chatParticipantsString = chat.participants
    .map((participant) =>
      participant.username === user.username ? "You" : participant.name
    )
    .join(", ");

  return (
    <div className="w-full flex justify-center items-center py-2 bg-white shadow-lg">
      <div className="flex">
        <button onClick={getInfo} className="flex-grow">
          <div className="flex justify-center items-center">
            <div className="mr-4">
              <img
                className="w-16 h-16 rounded-full"
                src={chat.displayChatImage.thumbnail}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div className="text-base text-slate-700 font-bold text-left">
                {chat.displayChatTitle}
              </div>
              <div className="text-sm text-slate-700">
                {chatParticipantsString}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
