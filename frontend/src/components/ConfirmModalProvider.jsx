import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ConfirmModalContext from "../contexts/ConfirmModalContext";

const ConfirmModalProvider = ({ children }) => {
  const [onConfirm, setOnConfirm] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const confirmModal = (message, onConfirmAction) => {
    const handleConfirm = () => {
      onConfirmAction();
      closeModal();
    };

    setOnConfirm(() => handleConfirm);
    setMessage(message);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage("");
  };

  return (
    <ConfirmModalContext.Provider value={{ confirmModal }}>
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
            <motion.div
              key={"confirmModal"}
              className="z-10 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg p-6 max-w-sm text-center"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, duration: 0.4 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.4, type: "tween" }}
            >
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Confirmation
              </h2>
              <div className="my-4 text-slate-800 dark:text-slate-100">
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
                  <div className="text-slate-800 dark:text-slate-100 font-bold">
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
                  <div className="text-slate-800 dark:text-slate-100 font-bold">
                    Cancel
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmModalContext.Provider>
  );
};

export default ConfirmModalProvider;
