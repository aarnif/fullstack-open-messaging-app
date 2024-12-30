import { motion } from "framer-motion";
import { useQuery } from "@apollo/client";
import { MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";

import { ALL_CONTACTS_BY_USER } from "../../../graphql/queries";

import Loading from "../../Loading";
import SearchBar from "../../SearchBar";
import SelectContactsList from "../NewGroupChatModal/SelectContactsList";
import useField from "../../../hooks/useField";

const UpdateMembersModal = ({
  chat,
  chosenUserIds,
  setChosenUserIds,
  setNewMemberIds,
  setShowUpdateMembersModal,
}) => {
  const searchWord = useField("text", "Search contacts by name or username...");

  const result = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  const handleCancel = () => {
    console.log("Cancel update members.");
    setShowUpdateMembersModal(false);
    setChosenUserIds([...chat.members.map((member) => member.id)]);
  };

  const handleUpdateMembers = () => {
    console.log("Update members:", chosenUserIds);
    setShowUpdateMembersModal(false);
    setNewMemberIds(chosenUserIds);
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowUpdateMembersModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        key={"updateMembersModal"}
        className="w-[500px] h-[600px] bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-100 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="h-full flex-grow flex flex-col pt-4 px-4">
          <div className="w-full flex justify-center items-center">
            <button className="text-2xl text-slate-700" onClick={handleCancel}>
              <MdClose className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
            </button>
            <h2 className="flex-grow text-2xl font-bold text-slate-700 dark:text-slate-100 text-center">
              Update Members
            </h2>
            <button
              data-testid="submit-update-group-chat-members-button"
              className="text-2xl text-slate-700"
              onClick={handleUpdateMembers}
            >
              <IoChevronForward className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
            </button>
          </div>
          <>
            <SearchBar searchWord={searchWord} />
            {result.loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex-grow w-full overflow-y-auto h-0">
                  <SelectContactsList
                    data={result.data.allContactsByUser.contacts}
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

export default UpdateMembersModal;
