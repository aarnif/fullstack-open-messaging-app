import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ConfirmModalContext from "../contexts/ConfirmModalContext";

const AlertModal = ({ closeModal, message }) => {
  return (
    <motion.div
      key={"alertModal"}
      className="z-10 p-6 m-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg max-w-sm text-center"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
    >
      <h2 className="text-lg lg:text-xl font-semibold text-slate-800 dark:text-slate-100">
        Alert
      </h2>
      <div className="my-4 text-mobile sm:text-lg text-slate-800 dark:text-slate-100">
        {message}
      </div>
      <div className="flex justify-center space-x-2">
        <button
          onClick={closeModal}
          data-testid="cancel-button"
          className="w-full max-w-[100px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 
        hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900
        active:scale-95 rounded-lg transition"
        >
          <div className="text-mobile sm:text-lg text-slate-800 dark:text-slate-100 font-bold">
            Close
          </div>
        </button>
      </div>
    </motion.div>
  );
};

const ConfirmModal = ({ closeModal, message, onConfirm }) => {
  return (
    <motion.div
      key={"confirmModal"}
      className="z-10 p-6 m-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg max-w-sm text-center"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
    >
      <h2 className="text-lg lg:text-xl font-semibold text-slate-800 dark:text-slate-100">
        Confirmation
      </h2>
      <div className="my-4 text-mobile sm:text-lg text-slate-800 dark:text-slate-100">
        {message}
      </div>
      <div className="flex justify-center space-x-2">
        <button
          onClick={onConfirm}
          data-testid="confirm-button"
          className="w-full max-w-[100px] p-2 flex justify-center items-center border-2 
        border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 
        active:scale-95 rounded-lg transition"
        >
          <div className="text-mobile sm:text-lg text-slate-800 dark:text-slate-100 font-bold">
            Confirm
          </div>
        </button>
        <button
          onClick={closeModal}
          data-testid="cancel-button"
          className="w-full max-w-[100px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 
        hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900
        active:scale-95 rounded-lg transition"
        >
          <div className="text-mobile sm:text-lg text-slate-800 dark:text-slate-100 font-bold">
            Cancel
          </div>
        </button>
      </div>
    </motion.div>
  );
};

const ModalProvider = ({ children }) => {
  const [onConfirm, setOnConfirm] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const modal = (type, message, onConfirmAction = () => {}) => {
    const handleConfirm = () => {
      onConfirmAction();
      closeModal();
    };

    setOnConfirm(() => handleConfirm);
    setType(type);
    setMessage(message);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage("");
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
            {type === "alert" ? (
              <AlertModal closeModal={closeModal} message={message} />
            ) : (
              <ConfirmModal
                closeModal={closeModal}
                message={message}
                onConfirm={onConfirm}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmModalContext.Provider>
  );
};

export default ModalProvider;
