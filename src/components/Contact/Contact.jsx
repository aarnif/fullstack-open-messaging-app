import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

import { GET_USER_BY_ID } from "../../../graphql/queries";
import ContactsMenu from "../ContactsMenu";

const Contact = ({ user, setActivePath }) => {
  const match = useMatch("/contacts/:contactId").params;
  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: match.contactId,
    },
  });

  useEffect(() => {
    setActivePath("contacts");
  });

  return (
    <div className="flex-grow flex">
      <ContactsMenu user={user} />
      <div className="flex-grow flex justify-center items-center">
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>Contact with id {match.contactId}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
