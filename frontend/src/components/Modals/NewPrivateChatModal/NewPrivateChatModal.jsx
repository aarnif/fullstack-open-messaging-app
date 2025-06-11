import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";

import {
  ALL_CONTACTS_BY_USER,
  FIND_CHAT_BY_MEMBERS,
  CHECK_IF_USER_HAS_BLOCKED_YOU,
} from "../../../graphql/queries";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import useField from "../../../hooks/useField";

import Loading from "../../Loading";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Title from "../../ui/Title";
import SelectContactList from "./SelectContactList";

import useNotifyMessage from "../../../hooks/useNotifyMessage";
import Notify from "../../ui/Notify";

const NewPrivateChatModal = ({ user, setShowNewPrivateChatModal }) => {
  const { width } = useWindowDimensions();
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();
  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserId, setChosenUserId] = useState(null);

  const result = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const [getChatByMembers] = useLazyQuery(FIND_CHAT_BY_MEMBERS);

  const [checkIfUserHasBlockedYou] = useLazyQuery(
    CHECK_IF_USER_HAS_BLOCKED_YOU
  );

  const handleCreatePrivateChat = async () => {
    if (!chosenUserId) {
      notifyMessage.show("Please select a contact to create a chat with!");
      return;
    }

    const checkIfChatExists = await getChatByMembers({
      variables: {
        members: [user.id, chosenUserId],
      },
    });

    if (checkIfChatExists.data?.findChatByMembers) {
      navigate(`/chats/${checkIfChatExists.data.findChatByMembers.id}`);
      setShowNewPrivateChatModal(false);
      return;
    }

    const checkIfContactHasBlockedYou = await checkIfUserHasBlockedYou({
      variables: {
        userId: chosenUserId,
      },
    });

    if (checkIfContactHasBlockedYou.data?.checkIfUserHasBlockedYou) {
      notifyMessage.show("This user has blocked you!");
      return;
    }

    const chosenContact = result.data.allContactsByUser.contacts.find(
      (contact) => contact.id === chosenUserId
    );

    const newPrivateChatInfo = {
      title: chosenContact.name,
      description: "",
      members: [user, chosenContact],
      image: chosenContact.image.thumbnail,
    };

    localStorage.setItem("new-chat-info", JSON.stringify(newPrivateChatInfo));
    navigate("/chats/new");
    setShowNewPrivateChatModal(false);
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black/50 z-10 transition"
      onClick={() => setShowNewPrivateChatModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        data-testid="new-private-chat-modal"
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
              testId="close-new-private-chat-modal"
              onClick={() => setShowNewPrivateChatModal(false)}
            />

            <Title
              variant="secondary"
              testId="add-new-contacts-modal-title"
              text="New Private Chat"
            />

            <Button
              type="button"
              variant="forward"
              testId="start-new-private-chat"
              onClick={handleCreatePrivateChat}
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
            <div className="flex-grow w-full overflow-y-auto">
              <SelectContactList
                user={user}
                data={result.data.allContactsByUser.contacts}
                chosenUserId={chosenUserId}
                setChosenUserId={setChosenUserId}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewPrivateChatModal;
