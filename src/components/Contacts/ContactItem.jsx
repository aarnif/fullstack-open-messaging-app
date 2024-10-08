import { useNavigate } from "react-router-dom";
import ContactCard from "./ContactCard";

const ContactItem = ({ user, item, activePath, setActivePath }) => {
  const navigate = useNavigate();

  const handlePress = () => {
    console.log("Pressed contact named:", item.name);
    navigate(`/contacts/${item.id}`);
    setActivePath(item.id);
  };

  const classStyles =
    activePath === item.id
      ? "w-full flex items-start py-2 px-4 border-b bg-gray-200 hover:bg-gray-200 transition"
      : "w-full flex items-start py-2 px-4 border-b hover:bg-gray-200 transition";

  return (
    <button className={classStyles} onClick={handlePress}>
      <ContactCard user={user} item={item} />
    </button>
  );
};

export default ContactItem;
