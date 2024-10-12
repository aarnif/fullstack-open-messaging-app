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

const NewIndividualChatModal = ({ user, setShowNewIndividualChatModal }) => {
  const navigate = useNavigate();
  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserId, setChosenUserId] = useState(null);

  const res1 = useQuery(GET_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const res2 = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: {
      participants: [user.id, chosenUserId],
    },
  });

  const [mutate] = useMutation(CREATE_CHAT, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleCreateIndividualChat = async () => {
    console.log("Press create a individual new chat!");
    console.log("Chosen user id:", chosenUserId);

    // Check if user already has a chat with this contact and navigate to it
    if (res2.data?.findChatByParticipants) {
      console.log("Chat exists:", res2.data.findChatByParticipants);
      navigate(`/chats/${res2.data.findChatByParticipants.id}`);
      setShowNewIndividualChatModal(false);
      return;
    }

    try {
      const { data, error } = await mutate({
        variables: {
          title: "",
          description: "",
          participants: [user.id, chosenUserId],
        },
      });
      console.log("Data:", data);

      if (data) {
        console.log("Created chat:", data);
        navigate(`/chats/${data.createChat.id}`);
        setShowNewIndividualChatModal(false);
      }
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
    }
  };

  console.log("Selected user:", chosenUserId);

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowNewIndividualChatModal(false)}
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
              onClick={() => setShowNewIndividualChatModal(false)}
            >
              <MdClose className="w-7 h-7 text-slate-700 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-700 text-center">
              {"New Individual Chat"}
            </h2>
            <button
              className="text-2xl text-slate-700"
              onClick={handleCreateIndividualChat}
            >
              <IoChevronForward className="w-7 h-7 text-slate-700 fill-current" />
            </button>
          </div>
          <>
            <SearchBar searchWord={searchWord} />
            {res1.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactsList
                    user={user}
                    data={res1.data.allContactsByUser.contacts}
                    chosenUserId={chosenUserId}
                    setChosenUserId={setChosenUserId}
                  />
                </div>
              </>
            )}
          </>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewIndividualChatModal;
