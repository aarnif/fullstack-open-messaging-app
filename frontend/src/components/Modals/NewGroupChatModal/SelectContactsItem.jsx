import { useState, useEffect } from "react";
import ContactCard from "../../Contacts/ContactCard";
import { MdCheck } from "react-icons/md";

const SelectContactsItem = ({ item, chosenUserIds, setChosenUserIds }) => {
  const [isChosen, setIsChosen] = useState(false);

  useEffect(() => {
    const checkIfUserIsChosen = chosenUserIds.includes(item.id);
    if (checkIfUserIsChosen) setIsChosen(true);
  }, [chosenUserIds, item.id]);

  const handlePress = () => {
    console.log("Contact pressed:", item.id);
    if (isChosen) {
      setChosenUserIds((prev) => [...prev.filter((id) => id !== item.id)]);
    } else {
      setChosenUserIds((prev) => [...prev, item.id]);
    }
    setIsChosen(!isChosen);
  };

  return (
    <div
      onClick={handlePress}
      className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
    >
      <ContactCard item={item} />

      {isChosen ? (
        <div className="w-6 h-6 flex justify-center items-center border border-green-600 bg-green-600 rounded-full">
          <MdCheck size={20} className="text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 flex justify-center items-center border border-slate-300 rounded-full"></div>
      )}
    </div>
  );
};

export default SelectContactsItem;
