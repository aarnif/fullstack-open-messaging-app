import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import imageService from "../../services/imageService";
import { FIND_CHAT_BY_MEMBERS } from "../../graphql/queries";
import { ADD_MESSAGE_TO_CHAT, CREATE_CHAT } from "../../graphql/mutations";
import useModal from "../../hooks/useModal";
import useField from "../../hooks/useField";
import NewMessageBox from "../NewMessageBox";

const NewMessageInput = ({ user, chatId, newChatInfo }) => {
  const navigate = useNavigate();
  const { modal } = useModal();
  const message = useField("text", "New Message...");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const isNewChat = !chatId && newChatInfo;

  const [createChat] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors?.[0]?.message || error.message);
    },
  });

  const [addMessageToChat] = useMutation(ADD_MESSAGE_TO_CHAT, {
    onError: (error) => {
      modal("alert", "Notification", error.graphQLErrors[0].message);
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleCreateChat = async () => {
    if (!message.value && !base64Image) {
      console.log("Do not send empty message!");
      return;
    }

    try {
      const { data } = await createChat({
        variables: {
          title: newChatInfo.title ? newChatInfo.title : "",
          description: newChatInfo.description ? newChatInfo.description : "",
          memberIds: newChatInfo.members.map((member) => member.id),
          initialMessage: {
            type: "message",
            content: message.value,
          },
        },
        refetchQueries: [
          {
            query: FIND_CHAT_BY_MEMBERS,
            variables: {
              members: newChatInfo.members.map((member) => member.id),
            },
          },
        ],
      });

      if (data) {
        console.log("Created chat successfully");

        if (base64Image) {
          console.log("Uploading chat picture...");
          await imageService.uploadImage(data.createChat.id, base64Image);
        }

        navigate(`/chats/${data.createChat.id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
    }
  };

  const handleAddMessage = async () => {
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

      await addMessageToChat({
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

  const handleSubmit = isNewChat ? handleCreateChat : handleAddMessage;

  return (
    <NewMessageBox
      user={user}
      message={message}
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleSubmit}
    />
  );
};

export default NewMessageInput;
