import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaExclamation } from "react-icons/fa6";

import ConfirmModalContext from "../contexts/ConfirmModalContext";
import Title from "./ui/Title";
import Button from "./ui/Button";

const ModalTitleWithIcon = ({
  title,
  testId = "modal-title",
  variant = "alert",
}) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case "success":
        return {
          outerCircle: "bg-green-300",
          innerCircle: "bg-green-100 border-green-400",
          icon: "text-green-900",
        };
      case "danger":
        return {
          outerCircle: "bg-red-300",
          innerCircle: "bg-red-100 border-red-400",
          icon: "text-red-900",
        };
      case "alert":
      default:
        return {
          outerCircle: "bg-yellow-300",
          innerCircle: "bg-yellow-100 border-yellow-400",
          icon: "text-yellow-900",
        };
    }
  };

  const styles = getVariantStyles(variant);

  return (
    <div className="flex justify-start items-center gap-3">
      <div
        className={`w-10 h-10 flex justify-center items-center rounded-full ${styles.outerCircle}`}
      >
        <div
          className={`w-7 h-7 flex justify-center items-center rounded-full border-2 ${styles.innerCircle}`}
        >
          <FaExclamation
            className={`w-[1.1rem] h-[1.1rem] fill-current ${styles.icon}`}
          />
        </div>
      </div>
      <Title variant={variant} testId={testId} text={title} />
    </div>
  );
};

const BaseModal = ({ children, variant, testId, title, message }) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case "success":
        return "rounded-lg border-l-4 border-green-900 bg-green-50";
      case "danger":
        return "rounded-lg border-l-4 border-red-900 bg-red-50";
      case "alert":
      default:
        return "bg-yellow-50 rounded-lg border-t border-yellow-900";
    }
  };

  const getTextColor = (variant) => {
    switch (variant) {
      case "success":
        return "text-green-700";
      case "danger":
        return "text-red-700";
      case "alert":
      default:
        return "text-yellow-700";
    }
  };

  return (
    <motion.div
      data-testid={testId}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, duration: 0.4 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ delay: 0.4, type: "tween" }}
      className={`mx-4 p-8 w-full max-w-[450px] flex flex-col gap-6 ${getVariantStyles(
        variant
      )}`}
    >
      <ModalTitleWithIcon
        title={title}
        testId={`${variant}-modal-title`}
        variant={variant}
      />
      <p className={`w-full text-base ${getTextColor(variant)}`}>{message}</p>
      {children}
    </motion.div>
  );
};

const AlertModal = ({ title, message, closeModal }) => {
  return (
    <BaseModal
      variant="alert"
      testId="alert-modal"
      title={title}
      message={message}
    >
      <Button
        type="button"
        variant="close-alert"
        testId="close-modal-button"
        text="Close"
        onClick={closeModal}
      />
    </BaseModal>
  );
};

const ConfirmModal = ({
  variant,
  title,
  message,
  confirmText,
  closeModal,
  onConfirm,
}) => {
  return (
    <BaseModal
      testId="confirm-modal"
      variant={variant}
      title={title}
      message={message}
    >
      <div className="flex gap-2">
        <Button
          type="button"
          variant="cancel-button"
          testId="cancel-button"
          text="Cancel"
          onClick={closeModal}
        />
        <Button
          type="button"
          variant={variant === "success" ? "success-confirm" : "danger-confirm"}
          testId="confirm-button"
          text={confirmText}
          onClick={onConfirm}
        />
      </div>
    </BaseModal>
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
      <ConfirmModal
        variant="success"
        title={title}
        message={message}
        confirmText={confirmText}
        closeModal={closeModal}
        onConfirm={onConfirm}
      />
    ),
    danger: (
      <ConfirmModal
        variant="danger"
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
            data-testid="modal-provider"
            key={"Overlay"}
            className="z-10 fixed inset-0 flex items-center justify-center bg-black/50"
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
