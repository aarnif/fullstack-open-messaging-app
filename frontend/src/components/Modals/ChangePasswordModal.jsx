import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";

import { CHANGE_PASSWORD } from "../../graphql/mutations";
import useModal from "../../hooks/useModal";
import useField from "../../hooks/useField";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useNotifyMessage from "../../hooks/useNotifyMessage";

import Notify from "../ui/Notify";
import Title from "../ui/Title";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ChangePasswordModal = ({ setShowChangePasswordModal }) => {
  const { modal } = useModal();
  const { width } = useWindowDimensions();
  const notifyMessage = useNotifyMessage();
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const currentPassword = useField(
    "password",
    "Enter your current password..."
  );
  const newPassword = useField("password", "Enter your new password...");
  const confirmNewPassword = useField(
    "password",
    "Confirm your new password..."
  );

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    console.log("Handle submit change password...");

    if (
      !currentPassword.value ||
      !newPassword.value ||
      !confirmNewPassword.value
    ) {
      console.log("Please fill in all fields");
      notifyMessage.show("Please fill in all fields");
      return;
    }

    console.log("Updating password...");
    try {
      await changePassword({
        variables: {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
          confirmNewPassword: confirmNewPassword.value,
        },
      });
      setShowChangePasswordModal(false);
      console.log("Password changed successfully");
      modal("alert", "Notification", "Password changed successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      notifyMessage.show(error.message);
    }
  };

  return (
    <motion.div
      key={"Overlay"}
      className="fixed inset-0 flex justify-center items-end sm:items-center bg-black bg-opacity-50 z-10 transition"
      onClick={() => setShowChangePasswordModal(false)}
      initial={{ width: "0vw", opacity: 0 }}
      animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
      exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
    >
      <motion.div
        data-testid="change-password-modal"
        key={"newChatModal"}
        className="p-4 w-full max-w-[500px] flex flex-col bg-white dark:bg-slate-700 rounded-t-xl sm:rounded-xl text-slate-800 dark:text-slate-100 z-100"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, duration: 0.4 }}
        exit={{ y: width <= 640 ? 50 : -50, opacity: 0 }}
        transition={{ delay: 0.4, type: "tween" }}
      >
        <div className="w-full flex justify-end items-center">
          <Button
            type="button"
            variant="close"
            testId="close-change-password-modal"
            onClick={() => setShowChangePasswordModal(false)}
          />
        </div>
        <form
          className="w-full flex-grow flex flex-col justify-center items-center"
          onSubmit={handleUpdatePassword}
        >
          <Title
            variant="primary"
            testId="change-password-title"
            text="Change Your Password"
          />
          <p className="font-medium text-slate-800 dark:text-slate-100 text-center">
            Enter your current password and a new password.
          </p>
          <Notify notifyMessage={notifyMessage} />
          <div className="mt-4 w-full flex-grow flex flex-col gap-4">
            <div className="w-full flex flex-col">
              <Label title="Current Password" />
              <Input item={currentPassword} testId="current-password-input" />
            </div>

            <div className="w-full flex flex-col">
              <Label title="New Password" />
              <Input item={newPassword} testId="new-password-input" />
            </div>

            <div className="w-full flex flex-col">
              <Label title="Confirm New Password" />
              <Input
                item={confirmNewPassword}
                testId="confirm-new-password-input"
              />
            </div>

            <div className="mt-2 w-full flex flex-col-reverse sm:flex-row justify-center items-end gap-4">
              <Button
                type="button"
                variant="secondary"
                testId="cancel-change-password-button"
                text="Cancel"
                onClick={() => setShowChangePasswordModal(false)}
              />
              <Button
                type="submit"
                variant="primary"
                testId="submit-change-password-button"
                text="Change Password"
              />
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;
