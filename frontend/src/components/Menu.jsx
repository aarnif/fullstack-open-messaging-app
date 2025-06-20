import { useNavigate } from "react-router";
import { useApolloClient } from "@apollo/client";
import {
  FaComments,
  FaAddressBook,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";
import useModal from "../hooks/useModal";

const MenuTitle = ({ title }) => {
  return (
    <div className="hidden absolute left-20 h-10 w-28 opacity-0 peer-hover:animate-fade-in peer-hover:opacity-100 lg:flex justify-center items-center text-slate-800 dark:text-white font-bold bg-slate-200 rounded-lg dark:bg-slate-800 transition pointer-events-none">
      {chatAndMessageHelpers.capitalizeString(title)}
      <div className="absolute left-[-8px] border-t-[10px] border-t-transparent border-r-[10px] border-r-slate-200 dark:border-r-slate-800 border-b-[10px] border-b-transparent"></div>
    </div>
  );
};

const MenuItem = ({ item, onClick, activeMenuItem }) => {
  return (
    <div className="relative flex items-center">
      <button
        onClick={onClick}
        data-testid={item["data-testid"]}
        className={
          item.id === activeMenuItem
            ? "group peer w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-violet-500 flex justify-center items-center active:scale-95 transition"
            : "group peer w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-200 dark:bg-slate-500 flex justify-center items-center hover:rounded-lg hover:bg-violet-500 active:scale-95 transition"
        }
      >
        {item.icon}
      </button>
      <MenuTitle title={item.id} />
    </div>
  );
};

const Menu = ({
  activeMenuItem,
  setActiveMenuItem,
  setActiveListMenuComponent,
  setActiveChatOrContactId,
}) => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { modal } = useModal();

  const handleNavigation = (event, path) => {
    setActiveMenuItem(event.target.closest("li").id);
    console.log("Navigating to:", path);

    if (path === "/chats") {
      setActiveListMenuComponent("chats");
    } else if (path === "/contacts") {
      setActiveListMenuComponent("contacts");
    }
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    client.resetStore();
    setActiveChatOrContactId(null);
    navigate("/signin");
  };

  const menuItemStyles = {
    active: "w-7 h-7 sm:w-9 sm:h-9 text-white fill-current",
    inactive:
      "w-7 h-7 sm:w-9 sm:h-9 text-slate-800 group-hover:text-white fill-current",
  };

  const menuItems = [
    {
      id: "chats",
      icon: (
        <FaComments
          className={
            activeMenuItem === "chats"
              ? menuItemStyles.active
              : menuItemStyles.inactive
          }
        />
      ),
      path: "/chats",
      onClick: (e) => handleNavigation(e, "/chats"),
      "data-testid": "chats-button",
    },
    {
      id: "contacts",
      icon: (
        <FaAddressBook
          className={
            activeMenuItem === "contacts"
              ? menuItemStyles.active
              : menuItemStyles.inactive
          }
        />
      ),
      path: "/contacts",
      onClick: (e) => handleNavigation(e, "/contacts"),
      "data-testid": "contacts-button",
    },
    {
      id: "profile",
      icon: (
        <FaUserCircle
          className={
            activeMenuItem === "profile"
              ? menuItemStyles.active
              : menuItemStyles.inactive
          }
        />
      ),
      path: "/profile",
      onClick: (e) => handleNavigation(e, "/profile"),
      "data-testid": "profile-button",
    },
    {
      id: "settings",
      icon: (
        <FaCog
          className={
            activeMenuItem === "settings"
              ? menuItemStyles.active
              : menuItemStyles.inactive
          }
        />
      ),
      path: "/settings",
      onClick: (e) => handleNavigation(e, "/settings"),
      "data-testid": "settings-button",
    },
    {
      id: "logout",
      icon: <FaSignOutAlt className={menuItemStyles.inactive} />,
      path: "/logout",
      onClick: () =>
        modal(
          "danger",
          "Log Out",
          "Are you sure you want to logout?",
          "Log Out",
          handleLogout
        ),
      "data-testid": "logout-button",
    },
  ];

  return (
    <div data-testid="menu" className="bg-slate-200 dark:bg-slate-800">
      <ul className="px-4 lg:px-0 py-0 lg:py-2 flex flex-row lg:flex-col justify-around lg:justify-center items-center">
        {menuItems.map((item, index) => (
          <li key={index} id={item.id} className="m-1 lg:m-2">
            <MenuItem
              item={item}
              onClick={item.onClick}
              activeMenuItem={activeMenuItem}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
