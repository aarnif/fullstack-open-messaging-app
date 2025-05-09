import SelectContactsItem from "./SelectContactsItem";

const SelectContactsList = ({ data, chosenUserIds, setChosenUserIds }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col justify-start items-center bg-white dark:bg-slate-800 w-full h-full">
        <div className="mt-8 text-2xl font-bold text-slate-200">
          No contacts found
        </div>
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
