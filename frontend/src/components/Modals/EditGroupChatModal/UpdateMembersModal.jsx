import { motion } from "framer-motion";
import { useQuery } from "@apollo/client";
import { FaSearch } from "react-icons/fa";

import { ALL_CONTACTS_BY_USER } from "../../../graphql/queries";

import useWindowDimensions from "../../../hooks/useWindowDimensions";
import useField from "../../../hooks/useField";

import Button from "../../ui/Button";
import Title from "../../ui/Title";
import Input from "../../ui/Input";
import Loading from "../../Loading";
import SelectContactsList from "../../ui/SelectContactsList";

const UpdateMembersModal = ({
  chat,
  chosenUserIds,
  setChosenUserIds,
  setNewMemberIds,
  setShowUpdateMembersModal,
}) => {
  const { width } = useWindowDimensions();
  const searchWord = useField("text", "Search contacts by name or username...");

  const result = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const handleCancel = () => {
    setShowUpdateMembersModal(false);
    setChosenUserIds([...chat.members.map((member) => member.id)]);
  };

  const handleUpdateMembers = () => {
    setShowUpdateMembersModal(false);
    setNewMemberIds(chosenUserIds);
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black/50 z-10 transition"
      onClick={() => setShowUpdateMembersModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        data-testid="update-members-modal"
        key={"updateMembersModal"}
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
              testId="close-update-members-modal-button"
              onClick={handleCancel}
            />

            <Title
              variant="secondary"
              testId="update-members-modal-title"
              text="Update Members"
            />

            <Button
              type="button"
              variant="forward"
              testId="submit-update-group-chat-members-button"
              onClick={handleUpdateMembers}
            />
          </div>
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
                data={result.data.allContactsByUser.contacts}
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

export default UpdateMembersModal;
