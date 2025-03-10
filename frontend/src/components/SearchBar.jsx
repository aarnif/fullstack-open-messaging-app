import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchWord, dataTestId }) => {
  return (
    <div className="flex justify-center items-center my-2 p-1 lg:p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
      <FaSearch className="w-4 h-4 text-slate-800 dark:text-slate-100 fill-current" />
      <input
        data-testid={dataTestId}
        className="text-mobile lg:text-base w-full pl-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
        {...searchWord}
      />
    </div>
  );
};

export default SearchBar;
