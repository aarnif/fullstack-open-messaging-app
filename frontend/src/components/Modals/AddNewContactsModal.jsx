import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";

import {
  ALL_CONTACTS_EXCEPT_BY_USER,
  ALL_CONTACTS_BY_USER,
} from "../../graphql/queries";
import { ADD_CONTACTS } from "../../graphql/mutations";
import useField from "../../hooks/useField";

import Button from "../ui/Button";
import Title from "../ui/Title";
import Input from "../ui/Input";
import Loading from "../Loading";
import SelectContactsList from "../ui/SelectContactsList";

import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../ui/Notify";

const AddNewContactsModal = ({ setShowAddNewContactsModal }) => {
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
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black/50 z-10 transition"
      onClick={() => setShowAddNewContactsModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"newContactModal"}
        data-testid="add-new-contacts-modal"
        className="w-full h-[90vh] sm:max-w-[500px] sm:max-h-[600px] bg-white dark:bg-slate-800 rounded-t-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="p-4 h-full flex flex-col gap-4">
          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              variant="close"
              testId="close-add-new-contacts-modal-button"
              onClick={() => setShowAddNewContactsModal(false)}
            />

            <Title
              variant="secondary"
              testId="add-new-contacts-modal-title"
              text="Add New Contacts"
            />

            <Button
              type="button"
              variant="forward"
              testId="add-new-contacts-button"
              onClick={handleAddNewContacts}
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
              <SelectContactsList
                data={result.data.allContactsExceptByUser}
                chosenUserIds={chosenUserIds}
                setChosenUserIds={setChosenUserIds}
              />
            </div>
          )}
          <p className="w-full font-bold text-center text-slate-700 dark:text-slate-100">
            {chosenUserIds.length} contacts selected
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddNewContactsModal;
