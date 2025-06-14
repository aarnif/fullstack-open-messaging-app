import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import { CREATE_CHAT } from "../graphql/mutations";
import { FIND_CHAT_BY_MEMBERS } from "../graphql/queries";
import imageService from "../services/imageService";
import useField from "../hooks/useField";
import NewMessageBox from "./NewMessageBox";
import { Messages } from "./Chat";
import ChatHeader from "./ui/ChatHeader";

export const NewChatAndFirstMessage = ({ user, newChatInfo }) => {
  const navigate = useNavigate();
  const message = useField("text", "New Message...");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const [createChat] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleCreateChat = async () => {
    console.log("Send message:", message.value);

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
      console.log(error.message);
    }
  };

  return (
    <NewMessageBox
      user={user}
      message={message}
      image={image}
      setImage={setImage}
      setBase64Image={setBase64Image}
      handleSubmit={handleCreateChat}
    />
  );
};

const NewChat = ({ user, setActiveMenuItem, menuComponent }) => {
  const newChatInfo = JSON.parse(localStorage.getItem("new-chat-info"));

  useEffect(() => {
    setActiveMenuItem("chats");
  }, [setActiveMenuItem]);

  return (
    <div data-testid="new-chat-page" className="flex-grow flex">
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex flex-col justify-start items-start">
        <ChatHeader
          user={user}
          chat={newChatInfo}
          setShowGroupChatInfoModal={null}
        />
        <Messages user={user} messages={[]} />
        <NewChatAndFirstMessage user={user} newChatInfo={newChatInfo} />
      </div>
    </div>
  );
};

export default NewChat;
