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
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={closeModal}
            initial={{ width: "0vw", opacity: 0 }}
            animate={{ width: "100vw", opacity: 1, duration: 1.0 }}
            exit={{ width: "0vw", opacity: 0, transition: { delay: 1.0 } }}
          >
            <motion.div
              key={"confirmModal"}
              className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, duration: 0.4 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.4, type: "tween" }}
            >
              <h2 className="text-xl font-semibold">Confirmation</h2>
              <div className="my-4">{message}</div>
              <div className="flex justify-center">
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 mr-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 ml-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                >
                  Cancel
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
