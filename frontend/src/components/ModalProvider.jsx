import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaExclamation } from "react-icons/fa6";

import ConfirmModalContext from "../contexts/ConfirmModalContext";

const AlertModal = ({ title, message, closeModal }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
      className="bg-yellow-50 rounded-lg border-t border-yellow-900"
    >
      <div className="w-full px-12 py-8 md:px-14 md:py-10 flex flex-col gap-4">
        <div className="flex justify-start items-center gap-3">
          <div className="w-8.5 h-8.5 md:w-10 md:h-10 flex justify-center items-center rounded-full bg-yellow-300">
            <div className="w-6 h-6 md:w-7 md:h-7 flex justify-center items-center rounded-full bg-yellow-100 border-2 border-yellow-400">
              <FaExclamation className="w-4 h-4 md:w-4.5 md:h-4.5 text-yellow-900 fill-current" />
            </div>
          </div>
          <h2 className="text-center text-yellow-900 text-lg md:text-xl font-semibold font-robo-condensed">
            {title}
          </h2>
        </div>
        <div className="self-stretch h-12 text-yellow-700 text-sm md:text-base">
          {message}
        </div>

        <button
          className="w-full px-4 py-2 bg-yellow-200 rounded-lg border border-yellow-200 shadow-xl flex justify-center items-center text-yellow-900 cursor-pointer text-sm md:text-base font-bold
              hover:bg-yellow-300 active:bg-yellow-300 active:border-yellow-400 active:inset-shadow-sm transition-all duration-300 ease-in-out"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

const SuccessModal = ({
  title,
  message,
  confirmText,
  closeModal,
  onConfirm,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
      className="bg-green-50 rounded-lg border-l-4 border-green-900"
    >
      <div className="w-full px-12 py-8 md:px-14 md:py-10 flex flex-col gap-4">
        <div className="flex justify-start items-center gap-3">
          <div className="w-8.5 h-8.5 md:w-10 md:h-10 flex justify-center items-center rounded-full bg-green-300">
            <div className="w-6 h-6 md:w-7 md:h-7 flex justify-center items-center rounded-full bg-green-100 border-2 border-green-400">
              <FaExclamation className="w-4 h-4 md:w-4.5 md:h-4.5 text-green-900 fill-current" />
            </div>
          </div>
          <h2 className="text-center text-green-900 text-lg md:text-xl font-semibold font-robo-condensed">
            {title}
          </h2>
        </div>
        <div className="self-stretch h-12 text-green-700 text-sm md:text-base">
          {message}
        </div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={closeModal}
            data-testid="cancel-button"
            className="w-full flex justify-center items-center text-base font-medium text-slate-700 dark:text-slate-200 hover:underline transition"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-button"
            className="w-full px-4 py-2 bg-green-200 rounded-lg border border-green-200 shadow-xl flex justify-center items-center text-green-900 cursor-pointer text-sm md:text-base font-bold
              hover:bg-green-300 active:bg-green-300 active:border-green-400 active:inset-shadow-sm transition-all duration-300 ease-in-out"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DangerModal = ({
  title,
  message,
  confirmText,
  closeModal,
  onConfirm,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
      className="bg-red-50 rounded-lg border-l-4 border-red-900"
    >
      <div className="w-full px-12 py-8 md:px-14 md:py-10 flex flex-col gap-4">
        <div className="flex justify-start items-center gap-3">
          <div className="w-8.5 h-8.5 md:w-10 md:h-10 flex justify-center items-center rounded-full bg-red-300">
            <div className="w-6 h-6 md:w-7 md:h-7 flex justify-center items-center rounded-full bg-red-100 border-2 border-red-400">
              <FaExclamation className="w-4 h-4 md:w-4.5 md:h-4.5 text-red-900 fill-current" />
            </div>
          </div>
          <h2 className="text-center text-red-900 text-lg md:text-xl font-semibold font-robo-condensed">
            {title}
          </h2>
        </div>
        <div className="self-stretch h-12 text-red-700 text-sm md:text-base">
          {message}
        </div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={closeModal}
            data-testid="cancel-button"
            className="w-full flex justify-center items-center text-base font-medium text-slate-700 dark:text-slate-200 hover:underline transition"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-button"
            className="w-full px-4 py-2  bg-red-200 rounded-lg border border-red-200 shadow-xl flex justify-center items-center text-red-900 cursor-pointer text-sm md:text-base font-bold
              hover:bg-red-300 active:bg-red-300 active:border-red-400 active:inset-shadow-sm transition-all duration-300 ease-in-out"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ModalProvider = ({ children }) => {
  const [onConfirm, setOnConfirm] = useState(null);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const modal = (
    type,
    title,
    message,
    confirmText,
    onConfirmAction = () => {}
  ) => {
    const handleConfirm = () => {
      onConfirmAction();
      closeModal();
    };

    setOnConfirm(() => handleConfirm);
    setType(type);
    setTitle(title);
    setMessage(message);
    setConfirmText(confirmText);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage("");
  };

  const modalComponents = {
    alert: (
      <AlertModal title={title} message={message} closeModal={closeModal} />
    ),
    success: (
      <SuccessModal
        title={title}
        message={message}
        confirmText={confirmText}
        closeModal={closeModal}
        onConfirm={onConfirm}
      />
    ),
    danger: (
      <DangerModal
        title={title}
        message={message}
        confirmText={confirmText}
        closeModal={closeModal}
        onConfirm={onConfirm}
      />
    ),
  };

  return (
    <ConfirmModalContext.Provider value={{ modal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={"Overlay"}
            className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
            onClick={closeModal}
            initial={{ width: "0vw", opacity: 0 }}
            animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
            exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
          >
            {modalComponents[type]}
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmModalContext.Provider>
  );
};

export default ModalProvider;
