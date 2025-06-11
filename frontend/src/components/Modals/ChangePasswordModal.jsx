import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { useMutation } from "@apollo/client";

import { CHANGE_PASSWORD } from "../../graphql/mutations";
import useModal from "../../hooks/useModal";
import useField from "../../hooks/useField";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useNotifyMessage from "../../hooks/useNotifyMessage";
import Notify from "../ui/Notify";

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
          <button
            data-testid="close-change-password-modal"
            onClick={() => setShowChangePasswordModal(false)}
          >
            <MdClose className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-slate-100 fill-current" />
          </button>
        </div>
        <form
          className="w-full flex-grow flex flex-col justify-center items-center"
          onSubmit={handleUpdatePassword}
        >
          <h1 className="mb-2 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
            Change Your Password
          </h1>
          <h2 className="mb-4 font-medium text-slate-800 dark:text-slate-100 text-center">
            Enter your current password and a new password.
          </h2>
          <Notify notifyMessage={notifyMessage} />
          <ul className="mt-2 w-full flex-grow flex flex-col">
            <li className="w-full flex flex-col">
              <label className="text-mobile lg:text-base font-bold text-slate-800 dark:text-slate-100">
                Current Password:
              </label>
            </li>
            <li className="mb-4 w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
              <input
                data-testid="current-password-input"
                className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                {...currentPassword}
              />
            </li>

            <li className="w-full flex flex-col">
              <label className="text-mobile lg:text-base font-bold text-slate-800 dark:text-slate-100">
                New Password:
              </label>
            </li>
            <li className="mb-4 w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
              <input
                data-testid="new-password-input"
                className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                {...newPassword}
              />
            </li>

            <li className="w-full flex flex-col">
              <label className="text-mobile lg:text-base font-bold text-slate-800 dark:text-slate-100">
                Confirm New Password:
              </label>
            </li>
            <li className="mb-4 w-full flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
              <input
                data-testid="confirm-new-password-input"
                className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
                {...confirmNewPassword}
              />
            </li>
            <li className="mt-6 w-full flex flex-col-reverse sm:flex-row justify-center items-end gap-4">
              <button
                data-testid="cancel-change-password-button"
                type="button"
                onClick={() => setShowChangePasswordModal(false)}
                className="w-full py-3 flex justify-center items-center text-mobile sm:text-base font-bold text-slate-800 dark:text-slate-100 border-2 
                    border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
                    active:scale-95 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                data-testid="submit-change-password-button"
                type="submit"
                className="w-full py-3 flex justify-center items-center text-mobile sm:text-base font-bold text-slate-800 dark:text-slate-100 border-2 
                    border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
                    active:scale-95 rounded-xl transition"
              >
                Change Password
              </button>
            </li>
          </ul>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;
