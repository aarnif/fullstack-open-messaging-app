import { useState } from "react";
import { useMutation } from "@apollo/client";

import imageService from "../../services/imageService";
import useField from "../../hooks/useField";
import { ADD_MESSAGE_TO_CHAT } from "../../graphql/mutations";
import NewMessageBox from "../NewMessageBox";
import useModal from "../../hooks/useModal";

const NewMessage = ({ user, chatId }) => {
  const { modal } = useModal();
  const message = useField("text", "New Message...");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [mutate] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      modal("alert", "Notification", error.graphQLErrors[0].message);
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSendMessage = async () => {
    console.log("Send message:", message.value);

    if (!message.value && !base64Image) {
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
          content: message.value,
          input: {
            thumbnail: base64Image ? result.data.thumb.url : null,
            original: base64Image ? result.data.image.url : null,
          },
        },
      });
      message.onReset();
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
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleSendMessage}
    />
  );
};

export default NewMessage;
