import SearchBar from "./SearchBar";
import { MdOpenInNew } from "react-icons/md";

const MenuHeader = ({ title, handleCallBack, searchWord }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-slate-800 dark:text-slate-100 font-bold">
          {title}
        </h1>
        <button onClick={handleCallBack}>
          <MdOpenInNew className="w-7 h-7 text-slate-700 dark:text-slate-100 fill-current" />
        </button>
      </div>

      <SearchBar searchWord={searchWord} />
    </div>
  );
};

export default MenuHeader;
