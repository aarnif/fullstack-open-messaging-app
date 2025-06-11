import Title from "./Title";
import SelectContactsItem from "../Modals/SelectContactsItem";

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
