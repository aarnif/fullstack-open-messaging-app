import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";

import {
  ALL_CONTACTS_BY_USER,
  FIND_GROUP_CHAT_BY_TITLE,
} from "../../graphql/queries";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useField from "../../hooks/useField";

import Loading from "../ui/Loading";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Title from "../ui/Title";
import SelectContactsList from "../ui/SelectContactsList";

import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../ui/Notify";

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
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black/50 z-10 transition"
      onClick={() => setShowNewGroupChatModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        data-testid="new-group-chat-modal"
        key={"newChatModal"}
        className="w-full h-[90vh] sm:max-w-[500px] sm:max-h-[600px] bg-white dark:bg-slate-800 rounded-t-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="p-4 h-full flex flex-col gap-4">
          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              variant="close"
              testId="close-new-group-chat-modal"
              onClick={() => setShowNewGroupChatModal(false)}
            />

            <Title
              variant="secondary"
              testId="new-group-chat-modal-title"
              text="New Group Chat"
            />

            <Button
              type="button"
              variant="forward"
              testId="start-new-group-chat-button"
              onClick={handleCreateGroupChat}
            />
          </div>

          <Notify notifyMessage={notifyMessage} />

          <Input
            item={searchWord}
            testId="search-contacts-input"
            icon={
              <FaSearch className="w-4 h-4 text-slate-800 dark:text-slate-100 fill-current" />
            }
          />
          {result.loading ? (
            <Loading />
          ) : (
            <>
              <div className="flex-grow w-full overflow-y-auto">
                <SelectContactsList
                  user={user}
                  data={result.data.allContactsByUser.contacts}
                  chosenUserIds={chosenUserIds}
                  setChosenUserIds={setChosenUserIds}
                />
              </div>
              <Input item={groupChatTitle} testId="group-chat-title-input" />
              <Input
                item={groupChatDescription}
                testId="group-chat-description-input"
              />
              <p className="w-full font-bold text-center text-slate-700 dark:text-slate-100">
                {chosenUserIds.length} contacts selected
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewGroupChatModal;
