import { useQuery } from "@apollo/client";

import { ALL_CONTACTS_BY_USER } from "../graphql/queries";
import useField from "../hooks/useField";
import Loading from "./Loading";
import ContactItem from "./Contacts/ContactItem";
import MenuHeader from "./MenuHeader";

const ContactsList = ({
  user,
  searchWord,
  activeChatOrContact,
  setActiveChatOrContact,
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
      <div className="flex justify-start items-center">
        <div className="mx-4 text-2xl font-bold text-slate-800 dark:text-white">
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
          activeChatOrContact={activeChatOrContact}
          setActiveChatOrContact={setActiveChatOrContact}
        />
      ))}
    </div>
  );
};

const ContactsMenu = ({
  user,
  handleClickNewContact,
  activeChatOrContact,
  setActiveChatOrContact,
}) => {
  const searchWord = useField("text", "Search contacts by name or username...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white dark:bg-slate-600">
      <div className="flex-grow flex flex-col overflow-y-auto h-0">
        <MenuHeader
          title={"Contacts"}
          handleCallBack={handleClickNewContact}
          searchWord={searchWord}
        />
        <ContactsList
          user={user}
          searchWord={searchWord}
          activeChatOrContact={activeChatOrContact}
          setActiveChatOrContact={setActiveChatOrContact}
        />
      </div>
    </div>
  );
};

export default ContactsMenu;
