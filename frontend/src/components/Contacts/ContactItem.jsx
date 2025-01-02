import { useNavigate } from "react-router";
import ContactCard from "./ContactCard";

const ContactItem = ({
  user,
  item,
  activeChatOrContact,
  setActiveChatOrContact,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Pressed contact named:", item.name);
    navigate(`/contacts/${item.id}`);
    setActiveChatOrContact(item.id);
  };

  const classStyles =
    activeChatOrContact === item.id
      ? "w-full flex items-start py-2 px-4 border-b bg-slate-200 dark:bg-slate-700 transition"
      : "w-full flex items-start py-2 px-4 border-b hover:bg-slate-200 dark:hover:bg-slate-700 transition";

  return (
    <button
      data-testid={item.username}
      className={classStyles}
      onClick={handleClick}
    >
      <ContactCard user={user} item={item} />
    </button>
  );
};

export default ContactItem;
