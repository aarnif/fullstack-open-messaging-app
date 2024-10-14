import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { MdSend } from "react-icons/md";

import { CREATE_CHAT, ADD_MESSAGE_TO_CHAT } from "../../../graphql/mutations";

const NewChatAndFirstMessage = ({ user, newChatInfo }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [createChat] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const [addMessageToChat] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSendMessageAndCreateChat = async () => {
    console.log("Send message:", message);

    if (!message) {
      console.log("Do not send empty message!");
      return;
    }
    try {
      const { data, error } = await createChat({
        variables: {
          title: newChatInfo.title ? newChatInfo.title : "",
          description: newChatInfo.description ? newChatInfo.description : "",
          participants: newChatInfo.participants.map(
            (participant) => participant.id
          ),
        },
      });
      console.log("Data:", data);

      if (data) {
        console.log("Created chat:", data);
        addMessageToChat({
          variables: {
            chatId: data.createChat.id,
            content: message,
            senderId: user.id,
          },
        });
        navigate(`/chats/${data.createChat.id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
    }
  };

  return (
    <div className="w-full h-[50px] p-2 flex bg-white text-slate-800">
      <input
        className="w-full p-2 bg-slate-100 rounded-xl"
        placeholder="New Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="mx-2 flex justify-center items-center">
        <button onClick={handleSendMessageAndCreateChat}>
          <MdSend size={26} color="#16a34a" />
        </button>
      </div>
    </div>
  );
};

export default NewChatAndFirstMessage;
