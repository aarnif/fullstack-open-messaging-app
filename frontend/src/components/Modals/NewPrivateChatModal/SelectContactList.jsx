import ContactCard from "../../Contacts/ContactCard";
import { MdCheck } from "react-icons/md";

const SelectContactItem = ({ item, chosenUserId, setChosenUserId }) => {
  const handlePress = () => {
    setChosenUserId(item.id);
  };

  return (
    <div
      onClick={handlePress}
      data-testid={`contact-${item.username}`}
      className="flex items-center px-0 py-2 sm:px-4 rounded-lg cursor-pointer"
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
    <div
      data-testid="select-contact-list"
      className="w-full bg-white dark:bg-slate-800"
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
