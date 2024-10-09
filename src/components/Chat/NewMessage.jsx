import { useState } from "react";
import { useMutation } from "@apollo/client";
import { MdSend } from "react-icons/md";

import { ADD_MESSAGE_TO_CHAT } from "../../../graphql/mutations";

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
    <div className="w-full h-[50px] p-2 flex bg-white text-slate-800">
      <input
        className="w-full p-2 bg-slate-100 rounded-xl"
        placeholder="New Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="mx-2 flex justify-center items-center">
        <button onClick={handleSendMessage}>
          <MdSend size={26} color="#16a34a" />
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
