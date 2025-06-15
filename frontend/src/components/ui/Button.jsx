import { IoChevronBack } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdOpenInNew, MdClose } from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import { MdSend } from "react-icons/md";

const Button = ({
  type,
  variant,
  testId,
  text = "",
  onClick,
  disabled = false,
}) => {
  const buttonStyles = {
    primary:
      "w-full px-6 py-3 text-base sm:text-lg font-bold text-white bg-green-500 border-2 border-green-500 rounded-xl hover:bg-green-600 focus:bg-green-600 active:scale-95 transition",
    secondary:
      "w-full px-6 py-3 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 border-2 border-slate-400 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-900 focus:bg-slate-300 active:scale-95 transition",
    tertiary:
      "w-full px-6 py-3 text-mobile sm:text-base font-bold text-slate-700 dark:text-slate-200 bg-slate-200 rounded-xl hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900 active:scale-95 transition",
    "new-chat-button":
      "w-full p-2 flex justify-start items-center rounded-xl text-md text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition",
    "close-alert":
      "w-full px-6 py-3 text-base font-bold text-yellow-900 bg-yellow-200 rounded-xl shadow-xl flex justify-center items-center hover:bg-yellow-300 active:scale-95 transition",
    "cancel-button":
      "w-full flex justify-center items-center text-base font-medium text-slate-500 hover:underline transition",
    "success-confirm":
      "w-full px-6 py-3 text-base font-bold text-green-900 bg-green-200 rounded-xl shadow-xl flex justify-center items-center hover:bg-green-300 active:scale-95 transition",
    "danger-confirm":
      "w-full px-6 py-3 text-base font-bold text-red-900 bg-red-200 rounded-xl shadow-xl flex justify-center items-center hover:bg-red-300 active:scale-95 transition",
    disabled:
      "w-full px-6 py-3 text-base font-bold text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 rounded-xl",
  };

  const content = {
    return: (
      <IoChevronBack className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
    ),
    close: (
      <MdClose className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
    ),
    forward: (
      <IoChevronForward className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
    ),
    "new-chat": (
      <MdOpenInNew className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
    ),
    "edit-chat": (
      <FiEdit className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300" />
    ),
    "edit-profile": (
      <FiEdit className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300" />
    ),
    "add-image-to-message": (
      <FaImage className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
    ),
    "add-emoji-to-message": (
      <FaRegSmile className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 hover:text-green-700 fill-current" />
    ),
    "send-new-message": (
      <MdSend className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 hover:text-green-700 fill-current" />
    ),
  };

  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles[variant] ? buttonStyles[variant] : ""}
    >
      {!text ? content[variant] : text}
    </button>
  );
};

export default Button;
