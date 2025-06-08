import Title from "./ui/Title";
import Input from "./ui/Input";
import { FaSearch } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";

const MenuHeader = ({ title, handleCallBack, searchWord }) => {
  return (
    <div data-testid="menu-header" className="p-4">
      <div className="mb-2 flex justify-between items-center">
        <Title variant="primary" testId="menu-header-title" text={title} />
        <button
          onClick={handleCallBack}
          data-testid={
            title === "Chats" ? "new-chat-button" : "new-contact-button"
          }
        >
          <MdOpenInNew className="w-6 h-6 lg:w-7 lg:h-7 text-slate-700 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 fill-current" />
        </button>
      </div>

      <Input
        item={searchWord}
        testId={
          title === "Contacts" ? "contact-search-input" : "chat-search-input"
        }
        icon={
          <FaSearch className="w-4 h-4 text-slate-800 dark:text-slate-100 fill-current" />
        }
      />
    </div>
  );
};

export default MenuHeader;
