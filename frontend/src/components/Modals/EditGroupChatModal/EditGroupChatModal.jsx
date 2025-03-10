import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { IoChevronBack } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

import { ALL_CONTACTS_BY_USER } from "../../../graphql/queries";
import { EDIT_GROUP_CHAT } from "../../../graphql/mutations";
import imageService from "../../../services/imageService";
import ChangeImage from "../../ChangeImage";
import useField from "../../../hooks/useField";
import ChatMembersList from "../GroupChatInfoModal/ChatMembersList";
import UpdateMembersModal from "./UpdateMembersModal";
import useModal from "../../../hooks/useModal";

const EditGroupChatModal = ({
  user,
  chat,
  chatAdmin,
  showEditGroupChatModal,
}) => {
  const { modal } = useModal();
  const [base64Image, setBase64Image] = useState(null);
  const [showUpdateMembersModal, setShowUpdateMembersModal] = useState(false);
  const title = useField("text", "Enter chat title here...", chat.title);
  const description = useField(
    "text",
    "Enter chat description here...",
    chat.description
  );
  const [chosenUserIds, setChosenUserIds] = useState([
    ...chat.members.map((member) => member.id),
  ]);

  const [newMemberIds, setNewMemberIds] = useState([
    ...chat.members.map((member) => member.id),
  ]);

  const result = useQuery(ALL_CONTACTS_BY_USER);

  const [editGroupChat] = useMutation(EDIT_GROUP_CHAT, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const goBack = (event) => {
    event.preventDefault();
    console.log("Go back to chat page!");
    showEditGroupChatModal(false);
  };

  const handleSubmit = async () => {
    console.log("Handle submit edit group chat...");

    try {
      let result;

      if (base64Image) {
        console.log("Uploading chat picture...");
        result = await imageService.uploadImage(chat.id, base64Image);
      }

      const newChatImage = base64Image
        ? {
            thumbnail: result.data.thumb.url,
            original: result.data.image.url,
          }
        : {
            thumbnail: chat.image.thumbnail,
            original: chat.image.original,
          };

      const newChatData = {
        chatId: chat.id,
        title: title.value,
        description: description.value,
        input: newChatImage,
        memberIds: chosenUserIds,
      };

      await editGroupChat({
        variables: newChatData,
      });

      console.log("Edit chat success!");
    } catch (error) {
      console.log("Error editing chat:", error);
      console.log(error);
    }

    setShowUpdateMembersModal(false);
    showEditGroupChatModal(false);
  };

  const handleClickSubmit = (event) => {
    event.preventDefault();
    modal(
      "success",
      "Edit Chat",
      "Are you sure you want to edit the chat information?",
      "Edit",
      handleSubmit
    );
  };

  return (
    <>
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-700 overflow-y-auto sm:overflow-hidden"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "100%", opacity: 1, duration: 0.2 }}
        exit={{ width: "0%", opacity: 0 }}
      >
        <div className="w-full flex-grow p-4 sm:p-8 flex flex-col">
          <div className="w-full flex-grow flex flex-col justify-center items-center">
            <div className="w-full flex justify-center items-center pb-4">
              <div className="w-[70px] flex justify-start items-center">
                <div className="w-8 h-8 rounded-full flex justify-center items-center">
                  <button onClick={goBack}>
                    <IoChevronBack className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-slate-100 fill-current" />
                  </button>
                </div>
              </div>
              <div className="flex-grow flex justify-center items-center">
                <h2 className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 font-bold">
                  Edit Chat
                </h2>
              </div>
              <div className="w-[70px] flex justify-end items-center">
                <div className="w-8 h-8 rounded-full flex justify-center items-center"></div>
              </div>
            </div>
            <form
              className="w-full flex-grow max-w-[1000px] flex flex-col"
              onSubmit={handleClickSubmit}
            >
              <ChangeImage
                currentImage={chat.image.thumbnail}
                imageType={"chat"}
                setBase64Image={setBase64Image}
              />
              <ul className="flex-grow flex flex-col">
                <li className="w-full flex flex-col">
                  <label className="text-mobile sm:text-base font-bold text-slate-800 dark:text-slate-100">
                    Chat title:
                  </label>
                </li>
                <li className="w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="edit-group-chat-title-input"
                    className="w-full text-mobile sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...title}
                  />
                </li>
                <li className="mb-2">
                  {title.value.length === 0 && (
                    <span className="pl-[10px] text-mobile sm:text-base text-red-500">
                      Please enter chat title
                    </span>
                  )}
                </li>

                <li className="w-full flex flex-col">
                  <label className="text-mobile sm:text-base font-bold text-slate-800 dark:text-slate-100">
                    Chat description:
                  </label>
                </li>
                <li className="w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
                  <input
                    data-testid="edit-group-chat-description-input"
                    className="w-full text-mobile sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                    {...description}
                  />
                </li>

                <li className="mb-2">
                  {description.value.length === 0 && (
                    <span className="pl-[10px] text-mobile sm:text-base text-red-500">
                      Please enter chat description
                    </span>
                  )}
                </li>

                <li className="my-4 w-full flex justify-center items-end">
                  <button
                    type="button"
                    data-testid="update-group-chat-members-button"
                    className="w-full max-h-[60px] p-2 flex justify-center items-center border-2 
                    border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
                    active:scale-95 rounded-xl transition"
                    onClick={() => setShowUpdateMembersModal(true)}
                  >
                    <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                      Update members
                    </div>
                  </button>
                </li>

                <li className="w-full flex-grow flex flex-col justify-center items-center">
                  <ChatMembersList
                    user={user}
                    chatMembers={
                      result.loading
                        ? chat.members
                        : result.data.allContactsByUser.contacts.filter(
                            (user) => newMemberIds.includes(user.id)
                          )
                    }
                    admin={chatAdmin}
                  />
                </li>

                <li className="my-4 w-full flex justify-center items-end">
                  <button
                    type="submit"
                    data-testid="edit-group-chat-submit-button"
                    className="w-full max-h-[60px] p-2 flex justify-center items-center border-2 
                    border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
                    active:scale-95 rounded-xl transition"
                  >
                    <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                      Edit Chat
                    </div>
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showUpdateMembersModal && (
          <UpdateMembersModal
            chat={chat}
            chosenUserIds={chosenUserIds}
            setChosenUserIds={setChosenUserIds}
            setNewMemberIds={setNewMemberIds}
            setShowUpdateMembersModal={setShowUpdateMembersModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EditGroupChatModal;
