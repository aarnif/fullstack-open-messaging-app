import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

import { DELETE_CHAT, BLOCK_OR_UNBLOCK_CONTACT } from "../../graphql/mutations";
import IndividualContactCard from "../IndividualContactCard/IndividualContactCard";
import useConfirmModal from "../../hooks/useConfirmModal";

const PrivateChatInfoModal = ({ user, chat, setShowChatInfoModal }) => {
  const { confirmModal } = useConfirmModal();
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const [haveContactBlockedYou, setHaveContactBlockedYou] = useState(null);

  const [deleteChat] = useMutation(DELETE_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const [blockOrUnblockContact] = useMutation(BLOCK_OR_UNBLOCK_CONTACT, {
    onError: (error) => {
      console.log("Error blocking contact mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleBlockContact = async () => {
    console.log("Press block/unblock contact button!");

    try {
      const { data } = await blockOrUnblockContact({
        variables: {
          contactId: contact.id,
        },
      });

      const isContactBlocked = data.blockOrUnBlockContact;

      if (isContactBlocked) {
        console.log("Blocked contact:", contact.id);
      } else {
        console.log("Unblocked contact:", contact.id);
      }
      setIsBlocked(isContactBlocked);
    } catch (error) {
      console.log("Error blocking contact:", error);
      console.log(error.message);
    }
  };

  const handleDeleteChat = async () => {
    console.log("Deleting private chat...");
    try {
      await deleteChat({
        variables: {
          chatId: chat.id,
        },
      });
      console.log(`Deleted private chat with contact ${contact.name}`);
      navigate("/chats");
    } catch (error) {
      console.log("Error deleting private chat:", error);
      console.log(error);
    }
  };

  const contact = chat.members.find(
    (member) => member.username !== user.username
  );

  return (
    <motion.div
      className="z-10 absolute top-0 left-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-700"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "100%", opacity: 1, duration: 0.2 }}
      exit={{ width: "0%", opacity: 0 }}
    >
      <div className="m-4 flex justify-between">
        <button onClick={() => setShowChatInfoModal(false)}>
          <IoChevronBack className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
        </button>
      </div>
      <div className="flex-grow">
        <IndividualContactCard user={user} contact={contact} />
        {isBlocked && (
          <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
            <div className="text-xl text-red-600 font-bold">
              You have blocked this contact!
            </div>
          </div>
        )}
        {haveContactBlockedYou && (
          <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
            <div className="text-xl text-red-600 font-bold">
              This contact has blocked you!
            </div>
          </div>
        )}
      </div>
      <div className="w-full p-4 flex flex-col justify-end items-start">
        <button
          onClick={() =>
            confirmModal(
              `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${
                contact.name
              }?`,
              handleBlockContact
            )
          }
          className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
        >
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isBlocked ? "Unblock Contact" : "Block Contact"}
          </div>
        </button>
        <button
          onClick={() =>
            confirmModal(
              `Are you sure you want to delete the chat? This removes the chat from both of you!`,
              handleDeleteChat
            )
          }
          className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
        >
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Delete Chat
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default PrivateChatInfoModal;
