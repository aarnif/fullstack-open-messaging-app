import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import {
  ALL_CONTACTS_BY_USER,
  FIND_GROUP_CHAT_BY_TITLE,
} from "../../graphql/queries";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useField from "../../hooks/useField";

import Loading from "../Loading";
import SearchBar from "../SearchBar";
import SelectContactsList from "./SelectContactsList";

import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../Notify";

const NewGroupChatModal = ({ user, setShowNewGroupChatModal }) => {
  const { width } = useWindowDimensions();
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();
  const groupChatTitle = useField("text", "Enter group chat title...");
  const groupChatDescription = useField(
    "text",
    "Enter group chat description..."
  );
  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserIds, setChosenUserIds] = useState([]);

  const result = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const [findGroupChatByTitle] = useLazyQuery(FIND_GROUP_CHAT_BY_TITLE);

  const handleCreateGroupChat = async () => {
    console.log("Press create a new group chat!");

    if (!groupChatTitle.value.trim().length) {
      notifyMessage.show("Please enter a group chat title!");
      return;
    }

    const checkIfGroupChatAlreadyExists = await findGroupChatByTitle({
      variables: {
        title: groupChatTitle.value.trim(),
      },
    });

    if (checkIfGroupChatAlreadyExists.data?.findGroupChatByTitle) {
      notifyMessage.show("Group chat with the same title already exists!");
      return;
    }

    if (chosenUserIds.length < 2) {
      notifyMessage.show(
        "Please select at least 2 contacts to create a group chat with!"
      );
      return;
    }

    const chosenContacts = result.data.allContactsByUser.contacts.filter(
      (contact) => chosenUserIds.includes(contact.id)
    );

    const newGroupChatInfo = {
      title: groupChatTitle.value.trim(),
      description: groupChatDescription.value.trim(),
      members: [user, ...chosenContacts],
      image: "https://i.ibb.co/bRb0SYw/chat-placeholder.png", // Placeholder image for grop chats
    };

    localStorage.setItem("new-chat-info", JSON.stringify(newGroupChatInfo));
    navigate("/chats/new");
    setShowNewGroupChatModal(false);
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowNewGroupChatModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"newChatModal"}
        className="w-full h-[90vh] sm:w-[500px] sm:h-[600px] bg-white dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-100 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="h-full flex-grow flex flex-col pt-4 px-4">
          <div className="w-full flex justify-center items-center">
            <button onClick={() => setShowNewGroupChatModal(false)}>
              <MdClose className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-slate-100 fill-current" />
            </button>
            <h2 className="flex-grow text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
              New Group Chat
            </h2>
            <button
              data-testid="start-new-group-chat-button"
              onClick={handleCreateGroupChat}
            >
              <IoChevronForward className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-slate-100 fill-current" />
            </button>
          </div>
          <>
            <Notify notifyMessage={notifyMessage} />
            <SearchBar searchWord={searchWord} />
            {result.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactsList
                    user={user}
                    data={result.data.allContactsByUser.contacts}
                    chosenUserIds={chosenUserIds}
                    setChosenUserIds={setChosenUserIds}
                  />
                </div>
                <div className="flex justify-center items-center my-2 p-1 sm:p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="group-chat-title-input"
                    className="w-full text-mobile lg:text-base pl-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...groupChatTitle}
                  />
                </div>

                <div className="flex justify-center items-center my-2 p-1 sm:p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="group-chat-description-input"
                    className="w-full text-mobile lg:text-base pl-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...groupChatDescription}
                  />
                </div>
                <div className="w-full h-[40px] flex justify-center items-center bg-white dark:bg-slate-800 font-bold">
                  {chosenUserIds.length} contacts selected
                </div>
              </>
            )}
          </>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewGroupChatModal;
