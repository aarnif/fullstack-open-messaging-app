import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import { CREATE_CHAT, ADD_MESSAGE_TO_CHAT } from "../graphql/mutations";
import { FIND_CHAT_BY_MEMBERS } from "../graphql/queries";
// import NewChatHeader from "./NewChatHeader";
import imageService from "../services/imageService";
import NewMessageBox from "./NewMessageBox";
import Messages from "./Chat/Messages";
// import NewChatAndFirstMessage from "./NewChatAndFirstMessage";

export const NewChatHeader = ({ user, chat }) => {
  const navigate = useNavigate();
  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
      const anotherChatMember = chat.members.find(
        (member) => member.username !== user.username
      );
      navigate(`/contacts/${anotherChatMember.id}`);
    }
  };

  const chatMembersString = chat.members
    .map((member) => (member.username === user.username ? "You" : member.name))
    .join(", ");

  return (
    <div
      data-testid="new-chat-header"
      className="w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg"
    >
      <div className="flex">
        <button
          data-testid="chat-info-button"
          onClick={getInfo}
          className="flex-grow"
        >
          <div className="flex justify-center items-center">
            <div className="mr-4">
              <img
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                src={chat.image}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div
                data-testid="new-chat-title"
                className="text-mobile sm:text-base text-slate-800 dark:text-slate-100 font-bold text-left"
              >
                {chat.title}
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {chatMembersString}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export const NewChatAndFirstMessage = ({ user, newChatInfo }) => {
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

const NewChat = ({ user, setActiveMenuItem, menuComponent }) => {
  const [newChatInfo, setNewChatInfo] = useState(
    JSON.parse(localStorage.getItem("new-chat-info"))
  );

  useEffect(() => {
    setActiveMenuItem("chats");
  }, [setActiveMenuItem]);

  return (
    <div data-testid="new-chat-page" className="flex-grow flex">
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex flex-col justify-start items-start">
        <NewChatHeader user={user} chat={newChatInfo} />
        <div className="flex-grow w-full overflow-y-auto h-0">
          <Messages user={user} messages={[]} />
        </div>
        <NewChatAndFirstMessage user={user} newChatInfo={newChatInfo} />
      </div>
    </div>
  );
};

export default NewChat;
