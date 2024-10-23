import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import {
  FaComments,
  FaAddressBook,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

import helpers from "../utils/helpers";
import useConfirmModal from "../hooks/useConfirmModal";

const MenuTitle = ({ title }) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute left-[80px] h-10 w-28 flex justify-center items-center bg-slate-800 rounded-lg"
    >
      <div className="text-white font-bold">
        {helpers.capitalizeString(title)}
      </div>
      <div className="absolute left-[-8px] border-t-[10px] border-t-transparent border-r-[10px] border-r-slate-800 border-b-[10px] border-b-transparent"></div>
    </motion.div>
  );
};

const MenuItem = ({ item, onClick, activePath }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex justify-between items-center">
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className={
          item.id === activePath
            ? "relative group w-14 h-14 rounded-lg bg-violet-500 flex justify-center items-center active:scale-95 transition"
            : "relative group w-14 h-14 rounded-full bg-slate-500 flex justify-center items-center hover:rounded-lg hover:bg-violet-500 active:scale-95 transition"
        }
      >
        {item.icon}
      </button>
      {hovered && <MenuTitle title={item.id} />}
    </div>
  );
};

const Menu = ({ activePath, setActivePath, setActiveMenuComponent }) => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { confirmModal } = useConfirmModal();

  const handleNavigation = (event, path) => {
    setActivePath(event.target.closest("li").id);
    console.log("Navigating to:", path);

    if (path === "/chats") {
      setActiveMenuComponent("chats");
    } else if (path === "/contacts") {
      setActiveMenuComponent("contacts");
    }
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    client.resetStore();
    navigate("/signin");
  };

  const menuItems = [
    {
      id: "chats",
      icon: (
        <FaComments
          className={
            activePath === "chats"
              ? "w-9 h-9 text-white fill-current"
              : "w-9 h-9 text-slate-700 group-hover:text-white fill-current"
          }
        />
      ),
      path: "/chats",
      onClick: (e) => handleNavigation(e, "/chats"),
    },
    {
      id: "contacts",
      icon: (
        <FaAddressBook
          className={
            activePath === "contacts"
              ? "w-9 h-9 text-white fill-current"
              : "w-9 h-9 text-slate-700 group-hover:text-white fill-current"
          }
        />
      ),
      path: "/contacts",
      onClick: (e) => handleNavigation(e, "/contacts"),
    },
    {
      id: "profile",
      icon: (
        <FaUserCircle
          className={
            activePath === "profile"
              ? "w-9 h-9 text-white fill-current"
              : "w-9 h-9 text-slate-700 group-hover:text-white fill-current"
          }
        />
      ),
      path: "/profile",
      onClick: (e) => handleNavigation(e, "/profile"),
    },
    {
      id: "settings",
      icon: (
        <FaCog
          className={
            activePath === "settings"
              ? "w-9 h-9 text-white fill-current"
              : "w-9 h-9 text-slate-700 group-hover:text-white fill-current"
          }
        />
      ),
      path: "/settings",
      onClick: (e) => handleNavigation(e, "/settings"),
    },
    {
      id: "logout",
      icon: (
        <FaSignOutAlt className="w-9 h-9 text-slate-700 group-hover:text-white fill-current" />
      ),
      path: "/logout",
      onClick: () =>
        confirmModal("Are you sure you want to logout?", handleLogout),
    },
  ];

  return (
    <div className="bg-slate-700">
      <ul className="flex flex-col my-2">
        {menuItems.map((item, index) => (
          <li key={index} id={item.id} className="m-2">
            <MenuItem
              item={item}
              onClick={item.onClick}
              activePath={activePath}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
