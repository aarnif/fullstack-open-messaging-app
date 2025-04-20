import { useLocation } from "react-router";

const Header = () => {
  const location = useLocation();
  const condition =
    location.pathname !== "/signin" && location.pathname !== "/signup";
  return (
    <div
      className={`w-full flex flex-row justify-center items-center py-2 ${
        condition && "bg-white shadow-lg dark:bg-slate-900"
      }`}
    >
      <div className="flex flex-row w-full max-w-4xl">
        <div className="flex-grow flex justify-center items-center">
          <h1
            data-testid="header-title"
            className="text-xl text-slate-800 dark:text-slate-100 font-bold"
          >
            Messaging App
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
