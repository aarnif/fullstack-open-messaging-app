import { useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_CONTACTS_BY_USER } from "../../graphql/queries";
import useField from "../../hooks/useField";
import SearchBar from "./SearchBar";
import ContactItem from "./Contacts/ContactItem";

const Header = ({ searchWord }) => {
  return (
    <div className="p-4">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl text-slate-800 font-bold">Contacts</h1>
      </div>

      <SearchBar searchWord={searchWord} />
    </div>
  );
};

const ContactsList = ({ user, searchWord }) => {
  const [activePath, setActivePath] = useState(null);
  const { data, loading } = useQuery(GET_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  console.log(data?.allContactsByUser.contacts.length);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.allContactsByUser.contacts.length) {
    return (
      <div className="flex justify-start items-center">
        <div className="m-4 text-2xl font-bold text-slate-700">
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
          activePath={activePath}
          setActivePath={setActivePath}
        />
      ))}
    </div>
  );
};

const ContactsMenu = ({ user }) => {
  const searchWord = useField("text", "Search contacts by name or username...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white">
      <Header searchWord={searchWord} />
      <ContactsList user={user} searchWord={searchWord} />
    </div>
  );
};

export default ContactsMenu;
