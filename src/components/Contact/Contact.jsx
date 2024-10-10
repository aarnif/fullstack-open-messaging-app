import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

import { GET_USER_BY_ID } from "../../../graphql/queries";
import ContactsMenu from "../ContactsMenu";
import IndividualContactCard from "../IndividualContactCard";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow flex">
      <ContactsMenu user={user} />
      <div className="flex-grow flex justify-center items-start">
        <div className="flex-grow p-8 flex flex-col justify-start items-center">
          <IndividualContactCard user={user} contact={data.findUserById} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
