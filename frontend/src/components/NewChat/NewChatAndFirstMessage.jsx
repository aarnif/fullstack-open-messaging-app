import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import { CREATE_CHAT, ADD_MESSAGE_TO_CHAT } from "../../graphql/mutations";
import { FIND_CHAT_BY_MEMBERS } from "../../graphql/queries";
import imageService from "../../services/imageService";
import NewMessageBox from "../NewMessageBox";

const NewChatAndFirstMessage = ({ user, newChatInfo }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

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

    if (!message && !base64Image) {
      console.log("Do not send empty message!");
      return;
    }

    try {
      const { data } = await createChat({
        variables: {
          title: newChatInfo.title ? newChatInfo.title : "",
          description: newChatInfo.description ? newChatInfo.description : "",
          memberIds: newChatInfo.members.map((member) => member.id),
        },
      });

      if (data) {
        console.log("Created chat:", data);
        let result;

        if (base64Image) {
          console.log("Uploading chat picture...");
          result = await imageService.uploadImage(
            data.createChat.id,
            base64Image
          );
        }

        addMessageToChat({
          variables: {
            chatId: data.createChat.id,
            content: message,
            senderId: user.id,
            input: {
              thumbnail: base64Image ? result.data.thumb.url : null,
              original: base64Image ? result.data.image.url : null,
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
        navigate(`/chats/${data.createChat.id}`);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
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
      handleSubmit={handleSendMessageAndCreateChat}
    />
  );
};

export default NewChatAndFirstMessage;
