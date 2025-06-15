import { useState } from "react";

import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import { LEAVE_GROUP_CHATS } from "../graphql/mutations";
import useModal from "../hooks/useModal";
import ChatMembersList from "./ui/ChatMembersList";
import EditGroupChatModal from "./Modals/EditGroupChatModal";
import ClickableImage from "./ui/ClickableImage";
import Title from "./ui/Title";
import Button from "./ui/Button";

const GroupChatInfo = ({ user, chat, setShowGroupChatInfo }) => {
  const { modal } = useModal();
  const [showEditGroupChatModal, setShowEditGroupChatModal] = useState(false);
  const navigate = useNavigate();
  const chatAdmin = chat.admin;

  const [mutate] = useMutation(LEAVE_GROUP_CHATS, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleLeaveChat = async () => {
    console.log("Leaving group chat...");
    try {
      await mutate({
        variables: {
          chatIds: [chat.id],
        },
      });
      console.log("Left group chat:", chat.title);
      navigate("/chats");
    } catch (error) {
      console.log("Error leaving chat:", error);
      console.log(error);
    }
  };

  const handleEditChat = () => {
    setShowEditGroupChatModal(true);
    console.log("Handle edit chat.");
  };

  return (
    <motion.div
      data-testid="group-chat-info-modal"
      className="z-10 p-4 absolute inset-0 flex flex-col items-center bg-slate-50 dark:bg-slate-700 overflow-y-auto"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "100%", opacity: 1, duration: 0.2 }}
      exit={{ width: "0%", opacity: 0 }}
    >
      <div className="w-full flex justify-between items-center">
        <Button
          type="button"
          variant="return"
          testId="close-group-chat-info-button"
          onClick={() => setShowGroupChatInfo(false)}
        />

        <Button
          type="button"
          variant="edit-chat"
          testId="edit-group-chat-button"
          onClick={user.id === chatAdmin.id ? handleEditChat : null}
        />
      </div>
      <div className="w-full max-w-[600px] flex-grow flex flex-col">
        <div className="w-full px-4 py-0 sm:py-4 flex flex-col justify-center items-center gap-4">
          <ClickableImage
            imageUri={chat.image.thumbnail}
            imageAlt={`${chat.title} image`}
            fullScreenImageUri={chat.image.original}
          />
          <div className="w-full flex flex-col justify-center items-center gap-1">
            <Title
              variant="secondary"
              testId="group-chat-title"
              text={chat.title}
            />
            <p className="text-sm text-slate-700 dark:text-slate-200 text-center">
              {!chat.description.length ? "No description" : chat.description}
            </p>
          </div>
        </div>
        <div className="p-4 w-full flex-grow flex flex-col justify-center items-center gap-6">
          <ChatMembersList
            user={user}
            chatMembers={chat.members}
            admin={chatAdmin}
          />
          {user.id !== chatAdmin.id && (
            <Button
              type="button"
              variant="tertiary"
              testId="leave-group-chat-button"
              text="Leave Chat"
              onClick={() =>
                modal(
                  "danger",
                  "Leave Chat",
                  "Are you sure you want to leave the chat?",
                  "Leave",
                  handleLeaveChat
                )
              }
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {showEditGroupChatModal && (
          <EditGroupChatModal
            user={user}
            chat={chat}
            chatAdmin={chatAdmin}
            showEditGroupChatModal={setShowEditGroupChatModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GroupChatInfo;
