import SelectContactItem from "./SelectContactItem";

const SelectContactsList = ({ data, chosenUserId, setChosenUserId }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col justify-start items-center bg-white w-full h-full">
        <p className="mt-8 text-2xl font-bold text-slate-200">
          No contacts found
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
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

export default SelectContactsList;
