import SearchBar from "./SearchBar";
import { MdOpenInNew } from "react-icons/md";

const MenuHeader = ({ title, handleCallBack, searchWord }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl text-slate-800 dark:text-slate-100 font-bold">
          {title}
        </h1>
        <button
          onClick={handleCallBack}
          data-testid={
            title === "Chats" ? "new-chat-button" : "new-contact-button"
          }
        >
          <MdOpenInNew className="w-6 h-6 lg:w-7 lg:h-7 text-slate-700 dark:text-slate-100 fill-current" />
        </button>
      </div>

      <SearchBar searchWord={searchWord} />
    </div>
  );
};

export default MenuHeader;
