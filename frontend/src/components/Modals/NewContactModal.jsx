import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import {
  GET_ALL_CONTACTS_EXCEPT_BY_USER,
  GET_CONTACTS_BY_USER,
} from "../../graphql/queries";
import { ADD_CONTACTS } from "../../graphql/mutations";
import useField from "../../hooks/useField";

import Loading from "../Loading";
import SearchBar from "../SearchBar";
import SelectContactsList from "./NewGroupChatModal/SelectContactsList";

import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../Notify";

const NewContactModal = ({ user, setShowNewContactModal }) => {
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();

  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserIds, setChosenUserIds] = useState([]);

  const res1 = useQuery(GET_ALL_CONTACTS_EXCEPT_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const [mutate] = useMutation(ADD_CONTACTS, {
    onError: (error) => {
      console.log("Error creating chat mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleAddNewContacts = async () => {
    console.log("Press add new contacts!");
    console.log("Chosen user ids:", chosenUserIds);

    if (chosenUserIds.length < 1) {
      notifyMessage.show("Please select at least one contact to add!");
      return;
    }

    try {
      const { data, error } = await mutate({
        variables: {
          contacts: chosenUserIds,
        },
        refetchQueries: [
          {
            query: GET_CONTACTS_BY_USER,
            variables: {
              searchByName: "",
            },
          },
          {
            query: GET_ALL_CONTACTS_EXCEPT_BY_USER,
            variables: {
              searchByName: "",
            },
          },
        ],
      });
    } catch (error) {
      console.log("Error creating chat:", error);
      console.log(error.message);
    }

    setShowNewContactModal(false);
    navigate("/contacts");
  };

  console.log("res1.data:", res1.data?.allContactsExceptByUser);
  console.log("chosenUserIds:", chosenUserIds);

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowNewContactModal(false)}
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
              onClick={() => setShowNewContactModal(false)}
            >
              <MdClose className="w-7 h-7 text-slate-700 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-700 text-center">
              Add New Contacts
            </h2>
            <button
              className="text-2xl text-slate-700"
              onClick={handleAddNewContacts}
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
                    data={res1.data.allContactsExceptByUser}
                    chosenUserIds={chosenUserIds}
                    setChosenUserIds={setChosenUserIds}
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

export default NewContactModal;