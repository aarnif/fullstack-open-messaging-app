import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchWord }) => {
  return (
    <div className="flex justify-center items-center my-2 p-2 border border-slate-700 rounded-lg bg-white hover:border-2 hover:border-green-600 focus-within:border-green-600 transition">
      <FaSearch className="w-4 h-4 text-slate-700 fill-current" />
      <input
        className="w-full pl-2 text-slate-700 focus:outline-none focus:bg-opacity-0"
        {...searchWord}
      />
    </div>
  );
};

export default SearchBar;
