import { useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";

import { GET_CONTACTS_BY_USER } from "../../graphql/queries";
import useField from "../../hooks/useField";
import Loading from "./Loading";
import ContactItem from "./Contacts/ContactItem";
import MenuHeader from "./MenuHeader";

const ContactsList = ({ user, searchWord }) => {
  const client = useApolloClient();
  const [activePath, setActivePath] = useState(null);
  const { data, loading } = useQuery(GET_CONTACTS_BY_USER, {
    variables: {
      searchByName: searchWord.value,
    },
  });

  console.log(data?.allContactsByUser.contacts.length);

  if (loading) {
    return <Loading />;
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

const ContactsMenu = ({ user, handleClickNewContact }) => {
  const searchWord = useField("text", "Search contacts by name or username...");

  return (
    <div className="flex-grow max-w-[450px] flex flex-col bg-white">
      <MenuHeader
        title={"Contacts"}
        handleCallBack={handleClickNewContact}
        searchWord={searchWord}
      />
      <ContactsList user={user} searchWord={searchWord} />
    </div>
  );
};

export default ContactsMenu;
