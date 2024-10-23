import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { CREATE_CHAT, ADD_MESSAGE_TO_CHAT } from "../../graphql/mutations";
import { GET_CHAT_BY_PARTICIPANTS } from "../../graphql/queries";
import NewMessageBox from "../NewMessageBox";

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
          refetchQueries: [
            {
              query: GET_CHAT_BY_PARTICIPANTS,
              variables: {
                participants: newChatInfo.participants.map(
                  (participant) => participant.id
                ),
              },
            },
          ],
        });
        navigate(`/chats/${data.createChat.id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
    }
  };

  return (
    <NewMessageBox
      message={message}
      setMessage={setMessage}
      handleSubmit={handleSendMessageAndCreateChat}
    />
  );
};

export default NewChatAndFirstMessage;
