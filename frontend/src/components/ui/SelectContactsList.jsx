import { useState, useEffect } from "react";
import { MdCheck } from "react-icons/md";

import Title from "./Title";
import ContactCard from "./ContactCard";

const SelectContactsItem = ({ item, chosenUserIds, setChosenUserIds }) => {
  const [isChosen, setIsChosen] = useState(false);

  useEffect(() => {
    const checkIfUserIsChosen = chosenUserIds.includes(item.id);
    if (checkIfUserIsChosen) setIsChosen(true);
  }, [chosenUserIds, item.id]);

  const handlePress = () => {
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
      data-testid={`contact-${item.username}`}
      className="flex items-center px-0 py-2 sm:px-4 rounded-lg cursor-pointer"
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

const SelectContactsList = ({ data, chosenUserIds, setChosenUserIds }) => {
  if (!data.length) {
    return (
      <div className="flex justify-center">
        <Title
          variant="secondary"
          testId="no-contacts-found-title"
          text="No contacts found"
        />
      </div>
    );
  }

  const selectedAndUnselectedUsers = [
    ...data.filter((item) => chosenUserIds.includes(item.id)),
    ...data.filter((item) => !chosenUserIds.includes(item.id)),
  ];

  return (
    <div
      data-testid="select-contacts-list"
      className="w-full bg-white dark:bg-slate-800"
    >
      {selectedAndUnselectedUsers.map((item) => (
        <SelectContactsItem
          key={item.id}
          item={item}
          chosenUserIds={chosenUserIds}
          setChosenUserIds={setChosenUserIds}
        />
      ))}
    </div>
  );
};

export default SelectContactsList;
