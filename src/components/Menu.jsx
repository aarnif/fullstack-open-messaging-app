import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import {
  FaComments,
  FaAddressBook,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Menu = ({ activePath, setActivePath, setActiveMenuComponent }) => {
  const navigate = useNavigate();
  const client = useApolloClient();

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
    localStorage.clear();
    client.resetStore();
    navigate("/signin");
  };

  const menuItems = [
    {
      id: "chats",
      icon: <FaComments className="w-8 h-8 text-green-500 fill-current" />,
      path: "/chats",
      onClick: (e) => handleNavigation(e, "/chats"),
    },
    {
      id: "contacts",
      icon: <FaAddressBook className="w-8 h-8 text-green-500 fill-current" />,
      path: "/contacts",
      onClick: (e) => handleNavigation(e, "/contacts"),
    },
    {
      id: "profile",
      icon: <FaUserCircle className="w-8 h-8 text-green-500 fill-current" />,
      path: "/profile",
      onClick: (e) => handleNavigation(e, "/profile"),
    },
    {
      id: "settings",
      icon: <FaCog className="w-8 h-8 text-green-500 fill-current" />,
      path: "/settings",
      onClick: (e) => handleNavigation(e, "/settings"),
    },
    {
      id: "logout",
      icon: <FaSignOutAlt className="w-8 h-8 text-green-500 fill-current" />,
      path: "/logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-green-500">
      <ul className="flex flex-col my-2">
        {menuItems.map((item, index) => (
          <li key={index} id={item.id} className="m-2">
            <button
              id={item.id}
              className={
                item.id === activePath
                  ? "w-12 h-12 rounded-lg bg-green-400 flex justify-center items-center hover:bg-green-400 active:scale-95 transition"
                  : "w-12 h-12 rounded-lg bg-green-300 flex justify-center items-center hover:bg-green-400 active:scale-95 transition"
              }
              onClick={item.onClick}
            >
              {item.icon}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
