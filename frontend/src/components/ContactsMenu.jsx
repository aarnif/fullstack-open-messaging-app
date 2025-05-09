import { useQuery } from "@apollo/client";

import { ALL_CONTACTS_BY_USER } from "../graphql/queries";
import useField from "../hooks/useField";
import Loading from "./Loading";
import ContactItem from "./Contacts/ContactItem";
import MenuHeader from "./MenuHeader";

const ContactsList = ({
  user,
  searchWord,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const { data, loading } = useQuery(ALL_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data.allContactsByUser.contacts.length) {
    return (
      <div
        data-testid="no-contacts-found"
        className="flex justify-start items-center"
      >
        <div className="mx-4 text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
          No contacts found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {data.allContactsByUser.contacts.map((item) => (
        <ContactItem
          key={item.id}
          user={user}
          item={item}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      ))}
    </div>
  );
};

const ContactsMenu = ({
  user,
  handleClickNewContact,
  activeChatOrContactId,
  setActiveChatOrContactId,
}) => {
  const searchWord = useField("text", "Search contacts by name or username...");

  return (
    <div
      data-testid="contacts-menu"
      className="flex-grow lg:max-w-[450px] flex flex-col bg-white dark:bg-slate-600"
    >
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        <MenuHeader
          title={"Contacts"}
          handleCallBack={handleClickNewContact}
          searchWord={searchWord}
        />
        <ContactsList
          user={user}
          searchWord={searchWord}
          activeChatOrContactId={activeChatOrContactId}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      </div>
    </div>
  );
};

export default ContactsMenu;
