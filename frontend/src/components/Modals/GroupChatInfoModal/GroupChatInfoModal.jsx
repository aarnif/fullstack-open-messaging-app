import { useState } from "react";

import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

import { LEAVE_GROUP_CHATS } from "../../../graphql/mutations";
import ChatMembersList from "./ChatMembersList";
import EditGroupChatModal from "../EditGroupChatModal/EditGroupChatModal";
import ClickableImage from "../../ClickableImage";
import useConfirmModal from "../../../hooks/useConfirmModal";

const GroupChatInfoModal = ({ user, chat, setShowChatInfoModal }) => {
  const { confirmModal } = useConfirmModal();
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
      className="z-10 absolute top-0 left-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-700 overflow-y-auto sm:overflow-hidden"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "100%", opacity: 1, duration: 0.2 }}
      exit={{ width: "0%", opacity: 0 }}
    >
      <div className="m-4 flex justify-between">
        <button
          data-testid="close-group-chat-info-button"
          onClick={() => setShowChatInfoModal(false)}
        >
          <IoChevronBack className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 fill-current" />
        </button>
        <button data-testid="edit-group-chat-button" onClick={handleEditChat}>
          <FiEdit className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100" />
        </button>
      </div>
      <div className="w-full py-0 sm:py-4 flex flex-col justify-center items-center">
        <ClickableImage
          imageUri={chat.image.thumbnail}
          imageAlt={`${chat.title} image`}
          fullScreenImageUri={chat.image.original}
        />
        <div className="pt-4 text-lg sm:text-xl text-slate-800 dark:text-slate-100 font-bold">
          {chat.title}
        </div>
        <div className="mx-8 text-sm text-slate-700 dark:text-slate-200 text-center">
          {!chat.description.length ? "No description" : chat.description}
        </div>
      </div>
      <div className="mb-0 sm:mb-8 w-full flex-grow flex flex-col justify-center items-center">
        <ChatMembersList
          user={user}
          chatMembers={chat.members}
          admin={chatAdmin}
        />
        {user.id !== chatAdmin.id && (
          <div className="w-full px-4 py-2 sm:p-4 flex flex-col justify-center items-start">
            <button
              onClick={() =>
                confirmModal(
                  "Are you sure you want to leave the chat?",
                  handleLeaveChat
                )
              }
              className="mb-0 sm:mb-2 w-full flex-grow max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
            >
              <div className="text-base sm:text-lg font-bold text-slate-700">
                Leave Chat
              </div>
            </button>
          </div>
        )}
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

export default GroupChatInfoModal;
