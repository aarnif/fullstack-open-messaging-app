import ContactCard from "../../Contacts/ContactCard";
import { MdCheck } from "react-icons/md";

const SelectContactItem = ({ item, chosenUserId, setChosenUserId }) => {
  const handlePress = () => {
    console.log("Contact pressed:", item.id);
    setChosenUserId(item.id);
  };

  return (
    <div
      onClick={handlePress}
      data-testid={`contact-${item.username}`}
      className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
    >
      <ContactCard item={item} />

      {item.id === chosenUserId ? (
        <div className="w-6 h-6 flex justify-center items-center border border-green-600 bg-green-600 rounded-full">
          <MdCheck size={20} className="text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 flex justify-center items-center border border-slate-300 rounded-full"></div>
      )}
    </div>
  );
};

export default SelectContactItem;
