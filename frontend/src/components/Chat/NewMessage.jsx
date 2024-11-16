import { useState } from "react";
import { useMutation } from "@apollo/client";

import imageService from "../../services/imageService";
import { ADD_MESSAGE_TO_CHAT } from "../../graphql/mutations";
import NewMessageBox from "../NewMessageBox";

const NewMessage = ({ user, chatId }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [mutate] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSendMessage = async () => {
    console.log("Send message:", message);

    if (!message && !base64Image) {
      console.log("Do not send empty message!");
      return;
    }

    try {
      let result;

      if (base64Image) {
        console.log("Uploading chat picture...");
        result = await imageService.uploadImage(chatId, base64Image);
      }

      await mutate({
        variables: {
          chatId: chatId,
          content: message,
          input: {
            thumbnail: base64Image ? result.data.thumb.url : null,
            original: base64Image ? result.data.image.url : null,
          },
        },
      });
      setMessage("");
      setImage(null);
      setBase64Image(null);
    } catch (error) {
      console.log("Error creating new message:", error);
    }
  };

  return (
    <NewMessageBox
      user={user}
      message={message}
      setMessage={setMessage}
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleSendMessage}
    />
  );
};

export default NewMessage;
