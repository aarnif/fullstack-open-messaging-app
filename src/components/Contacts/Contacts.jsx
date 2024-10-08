import ContactsMenu from "../ContactsMenu";

const Contacts = ({ user }) => {
  return (
    <div className="flex-grow flex">
      <ContactsMenu user={user} />
      <div className="flex-grow flex justify-center items-center">
        <div>Select a contact for further information.</div>
      </div>
    </div>
  );
};

export default Contacts;
