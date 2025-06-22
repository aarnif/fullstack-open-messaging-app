import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

import { ALL_CONTACTS_BY_USER } from "../graphql/queries";
import { EDIT_GROUP_CHAT } from "../graphql/mutations";
import imageService from "../services/imageService";
import useField from "../hooks/useField";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useModal from "../hooks/useModal";
import useNotifyMessage from "../hooks/useNotifyMessage";
import ChatMembersList from "./ui/ChatMembersList";
import Loading from "./ui/Loading";
import SelectContactsList from "./ui/SelectContactsList";
import ChangeImage from "./ui/ChangeImage";
import Notify from "./ui/Notify";
import Button from "./ui/Button";
import Title from "./ui/Title";
import Label from "./ui/Label";
import Input from "./ui/Input";

export const UpdateMembersModal = ({
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
                data={result.data.allContactsByUser}
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

const EditGroupChat = ({ user, chat, chatAdmin, setShowEditGroupChat }) => {
  const { modal } = useModal();
  const showNotifyMessage = useNotifyMessage();

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
      showNotifyMessage.show(error.graphQLErrors[0].message);
    },
  });

  const goBack = (event) => {
    event.preventDefault();
    console.log("Go back to chat page!");
    setShowEditGroupChat(false);
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
    setShowEditGroupChat(false);
  };

  const handleClickSubmit = (event) => {
    event.preventDefault();

    if (!title.value) {
      showNotifyMessage.show("Please enter chat title");
      return;
    }

    modal(
      "success",
      "Edit Chat",
      "Are you sure you want to edit the chat information?",
      "Edit",
      handleSubmit
    );
  };

  return (
    <motion.div
      data-testid="edit-group-chat-modal"
      className="z-10 px-8 py-4 absolute inset-0 flex flex-col items-center bg-slate-50 dark:bg-slate-700 overflow-y-auto"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "100%", opacity: 1, duration: 0.2 }}
      exit={{ width: "0%", opacity: 0 }}
    >
      <div className="w-full flex-grow flex flex-col justify-center items-center gap-4">
        <div className="relative w-full flex items-center">
          <Button
            type="button"
            variant="return"
            testId="close-edit-group-chat-modal-button"
            onClick={goBack}
          />
          <div className="absolute left-1/2 -translate-x-1/2">
            <Title
              variant="secondary"
              testId="edit-group-chat-title"
              text="Edit Chat"
            />
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
          <Notify notifyMessage={showNotifyMessage} />
          <div className="flex-grow flex flex-col gap-4">
            <div className="w-full flex flex-col">
              <Label title="chat title" />
              <Input item={title} testId="edit-group-chat-title-input" />
            </div>

            <div className="w-full flex flex-col">
              <Label title="chat description" />
              <Input
                item={description}
                testId="edit-group-chat-description-input"
              />
            </div>

            <Button
              type="button"
              variant="tertiary"
              testId="update-group-chat-members-button"
              text="Update members"
              onClick={() => setShowUpdateMembersModal(true)}
            />

            <ChatMembersList
              user={user}
              chatMembers={
                result.loading
                  ? chat.members
                  : result.data.allContactsByUser.filter((user) =>
                      newMemberIds.includes(user.id)
                    )
              }
              admin={chatAdmin}
            />

            <Button
              type="submit"
              variant="tertiary"
              testId="edit-group-chat-submit-button"
              text="Edit Chat"
            />
          </div>
        </form>
      </div>
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
    </motion.div>
  );
};

export default EditGroupChat;
