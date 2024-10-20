import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch } from "react-router-dom";

import { GET_USER_BY_ID } from "../../../graphql/queries";
import IndividualContactCard from "../IndividualContactCard/IndividualContactCard";
import IndividualContactOptions from "../IndividualContactCard/IndividualContactCardOptions";

const Contact = ({ user, setActivePath, menuComponent }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [haveContactBlockedYou, setHaveContactBlockedYou] = useState(null);

  const match = useMatch("/contacts/:contactId").params;
  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: match.contactId,
    },
  });

  useEffect(() => {
    setActivePath("contacts");
  }, []);

  useEffect(() => {
    if (data) {
      setIsBlocked(user.blockedContacts.includes(data.findUserById.id));
      setHaveContactBlockedYou(
        data.findUserById.blockedContacts.includes(user.id)
      );
    }
  }, [data]);

  console.log("Is blocked:", isBlocked);
  console.log("Have contact blocked you:", haveContactBlockedYou);

  return (
    <div className="flex-grow flex">
      {menuComponent}
      <div className="flex-grow flex justify-center items-start">
        <div className="flex-grow h-full p-8 flex flex-col justify-start items-center">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex-grow">
                <IndividualContactCard
                  user={user}
                  contact={data.findUserById}
                />
                {isBlocked && (
                  <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
                    <div className="text-xl text-red-600 font-bold">
                      You have blocked this contact!
                    </div>
                  </div>
                )}
                {haveContactBlockedYou && (
                  <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
                    <div className="text-xl text-red-600 font-bold">
                      This contact has blocked you!
                    </div>
                  </div>
                )}
              </div>
              <IndividualContactOptions
                user={user}
                contact={data.findUserById}
                isBlocked={isBlocked}
                setIsBlocked={setIsBlocked}
                haveContactBlockedYou={haveContactBlockedYou}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
