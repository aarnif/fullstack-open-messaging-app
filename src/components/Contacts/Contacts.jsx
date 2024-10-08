import useField from "../../../hooks/useField";
import ContactsMenu from "../ContactsMenu";

const Contacts = ({ user }) => {
  const searchWord = useField("text", "Enter your username here...");

  return (
    <div className="flex-grow flex">
      <ContactsMenu user={user} searchWord={searchWord} />
      <div className="flex-grow flex justify-center items-center">
        <div>Select a contact for further information.</div>
      </div>
    </div>
  );
};

export default Contacts;
