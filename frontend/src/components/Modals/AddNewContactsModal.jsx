import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import {
  ALL_CONTACTS_EXCEPT_BY_USER,
  ALL_CONTACTS_BY_USER,
} from "../../graphql/queries";
import { ADD_CONTACTS } from "../../graphql/mutations";
import useField from "../../hooks/useField";

import Loading from "../Loading";
import SearchBar from "../SearchBar";
import SelectContactsList from "../ui/SelectContactsList";

import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../Notify";

const AddNewContactsModal = ({ user, setShowAddNewContactsModal }) => {
  const notifyMessage = useNotifyMessage();
  const navigate = useNavigate();

  const searchWord = useField("text", "Search contacts by name or username...");
  const [chosenUserIds, setChosenUserIds] = useState([]);

  const result = useQuery(ALL_CONTACTS_EXCEPT_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const [mutate] = useMutation(ADD_CONTACTS, {
    onError: (error) => {
      console.log("Error adding contacts mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleAddNewContacts = async () => {
    if (chosenUserIds.length < 1) {
      notifyMessage.show("Please select at least one contact to add!");
      return;
    }
    console.log("Adding new contacts...");
    try {
      await mutate({
        variables: {
          userIds: chosenUserIds,
        },
        refetchQueries: [
          {
            query: ALL_CONTACTS_BY_USER,
            variables: {
              searchByName: "",
            },
          },
          {
            query: ALL_CONTACTS_EXCEPT_BY_USER,
            variables: {
              searchByName: "",
            },
          },
        ],
      });
    } catch (error) {
      console.log("Error adding contacts:", error);
      console.log(error.message);
    }

    setShowAddNewContactsModal(false);
    navigate("/contacts");
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowAddNewContactsModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"newContactModal"}
        data-testid="add-new-contacts-modal"
        className="w-[500px] h-[600px] bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-100 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="h-full flex-grow flex flex-col pt-4 px-4">
          <div className="w-full flex justify-center items-center">
            <button
              data-testid="close-add-new-contacts-modal-button"
              className="text-2xl text-slate-700"
              onClick={() => setShowAddNewContactsModal(false)}
            >
              <MdClose className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-700 dark:text-slate-100 text-center">
              Add New Contacts
            </h2>
            <button
              data-testid="add-new-contacts-button"
              className="text-2xl text-slate-700"
              onClick={handleAddNewContacts}
            >
              <IoChevronForward className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
            </button>
          </div>
          <>
            <Notify notifyMessage={notifyMessage} />
            <SearchBar
              searchWord={searchWord}
              dataTestId={"search-contacts-input"}
            />
            {result.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactsList
                    user={user}
                    data={result.data.allContactsExceptByUser}
                    chosenUserIds={chosenUserIds}
                    setChosenUserIds={setChosenUserIds}
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

export default AddNewContactsModal;
