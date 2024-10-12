import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import {
  GET_CONTACTS_BY_USER,
  GET_CHAT_BY_PARTICIPANTS,
} from "../../../../graphql/queries";
import { CREATE_CHAT } from "../../../../graphql/mutations";
import useField from "../../../../hooks/useField";

import Loading from "../../Loading";
import SearchBar from "../../SearchBar";
import SelectContactsList from "./SelectContactsList";

import useNotifyMessage from "../../../../hooks/useNotifyMessage";
import Notify from "../../Notify";

const NewGroupChatModal = ({ user, setShowNewGroupChatModal }) => {
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();
  const groupChatTitle = useField("text", "Enter group chat title...");
  const groupChatDescription = useField(
    "text",
    "Enter group chat description..."
  );
  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserIds, setChosenUserIds] = useState([]);

  const res1 = useQuery(GET_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const res2 = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: {
      participants: [user.id, ...chosenUserIds],
    },
  });

  const [mutate] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors[0].message);
      notifyMessage.show(error.graphQLErrors[0].message);
    },
  });

  const handleCreateGroupChat = async () => {
    console.log("Press create a new group chat!");
    console.log("Chosen user ids:", chosenUserIds);

    if (chosenUserIds.length < 2) {
      notifyMessage.show(
        "Please select at least 2 contacts to create a group chat with!"
      );
      return;
    }

    // Check if user already has a chat with this contact and navigate to it
    if (res2.data?.findChatByParticipants) {
      console.log("Chat exists:", res2.data.findChatByParticipants);
      navigate(`/chats/${res2.data.findChatByParticipants.id}`);
      setShowNewGroupChatModal(false);
      return;
    }

    try {
      const { data, error } = await mutate({
        variables: {
          title: groupChatTitle.value,
          description: groupChatDescription.value,
          participants: [user.id, ...chosenUserIds],
        },
      });
      console.log("Data:", data);

      if (data) {
        console.log("Created chat:", data);
        navigate(`/chats/${data.createChat.id}`);
        setShowNewGroupChatModal(false);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
    }
  };

  console.log("Selected users:", chosenUserIds);

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowNewGroupChatModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"newChatModal"}
        className="w-[500px] h-[600px] bg-white rounded-xl text-slate-700 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="h-full flex-grow flex flex-col pt-4 px-4">
          <div className="w-full flex justify-center items-center">
            <button
              className="text-2xl text-slate-700"
              onClick={() => setShowNewGroupChatModal(false)}
            >
              <MdClose className="w-7 h-7 text-slate-700 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-700 text-center">
              New Group Chat
            </h2>
            <button
              className="text-2xl text-slate-700"
              onClick={handleCreateGroupChat}
            >
              <IoChevronForward className="w-7 h-7 text-slate-700 fill-current" />
            </button>
          </div>
          <>
            <Notify notifyMessage={notifyMessage} />
            <SearchBar searchWord={searchWord} />
            {res1.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactsList
                    user={user}
                    data={res1.data.allContactsByUser.contacts}
                    chosenUserIds={chosenUserIds}
                    setChosenUserIds={setChosenUserIds}
                  />
                </div>
                <div className="flex justify-center items-center my-2 p-2 border-2 border-white rounded-lg bg-slate-100 hover:border-green-600 focus-within:border-green-600 transition">
                  <input
                    className="w-full pl-2 text-slate-700 bg-slate-100 focus:outline-none focus:bg-opacity-0"
                    {...groupChatTitle}
                  />
                </div>

                <div className="flex justify-center items-center my-2 p-2 border-2 border-white rounded-lg bg-slate-100 hover:border-green-600 focus-within:border-green-600 transition">
                  <input
                    className="w-full pl-2 text-slate-700 bg-slate-100 focus:outline-none focus:bg-opacity-0"
                    {...groupChatDescription}
                  />
                </div>
                <div className="w-full h-[40px] flex justify-center items-center bg-white font-bold">
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
