import { useState } from "react";
import { useMutation } from "@apollo/client";

import { ADD_MESSAGE_TO_CHAT } from "../../graphql/mutations";
import NewMessageBox from "../NewMessageBox";

const NewMessage = ({ chatId }) => {
  const [message, setMessage] = useState("");

  const [mutate] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSendMessage = async () => {
    console.log("Send message:", message);

    if (!message) {
      console.log("Do not send empty message!");
      return;
    }
    try {
      await mutate({
        variables: {
          chatId: chatId,
          content: message,
        },
      });
      setMessage("");
    } catch (error) {
      console.log("Error creating new message:", error);
    }
  };

  return (
    <NewMessageBox
      message={message}
      setMessage={setMessage}
      handleSubmit={handleSendMessage}
    />
  );
};

export default NewMessage;
