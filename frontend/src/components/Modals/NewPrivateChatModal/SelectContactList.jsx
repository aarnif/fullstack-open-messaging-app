import ContactCard from "../../Contacts/ContactCard";
import { MdCheck } from "react-icons/md";

const SelectContactItem = ({ item, chosenUserId, setChosenUserId }) => {
  const handlePress = () => {
    setChosenUserId(item.id);
  };

  return (
    <button
      onClick={handlePress}
      data-testid={`contact-${item.username}`}
      className="w-full flex items-center cursor-pointer"
    >
      <ContactCard item={item} />

      {item.id === chosenUserId ? (
        <div className="w-6 h-6 flex justify-center items-center border border-green-600 bg-green-600 rounded-full">
          <MdCheck size={20} className="text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 flex justify-center items-center border border-slate-300 rounded-full"></div>
      )}
    </button>
  );
};

const SelectContactList = ({ data, chosenUserId, setChosenUserId }) => {
  if (!data.length) {
    return (
      <p className="w-full mt-8 text-center text-xl font-semibold text-slate-600 dark:text-slate-300">
        No contacts found
      </p>
    );
  }

  return (
    <div
      data-testid="select-contact-list"
      className="px-2 w-full flex flex-col gap-4 bg-white dark:bg-slate-800"
    >
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
