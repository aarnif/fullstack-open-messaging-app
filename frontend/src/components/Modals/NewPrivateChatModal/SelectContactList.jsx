import SelectContactItem from "./SelectContactItem";

const SelectContactList = ({ data, chosenUserId, setChosenUserId }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col justify-start items-center bg-white dark:bg-slate-800 w-full h-full">
        <div className="mt-8 text-2xl font-bold text-slate-200">
          No contacts found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800">
      {data.map((item) => (
        <SelectContactItem
          key={item.id}
          item={item}
          chosenUserId={chosenUserId}
          setChosenUserId={setChosenUserId}
        />
      ))}
    </div>
  );
};

export default SelectContactList;
