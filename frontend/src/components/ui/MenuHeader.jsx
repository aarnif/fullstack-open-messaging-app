import { FaSearch } from "react-icons/fa";

import Title from "./Title";
import Button from "./Button";
import Input from "./Input";

const MenuHeader = ({ title, handleCallBack, searchWord }) => {
  return (
    <div data-testid="menu-header" className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Title variant="primary" testId="menu-header-title" text={title} />
        <Button
          type="button"
          variant="new-chat"
          testId={title === "Chats" ? "new-chat-button" : "new-contact-button"}
          onClick={handleCallBack}
        />
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
