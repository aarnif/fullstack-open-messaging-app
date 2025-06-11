import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useMatch, useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";

import { FIND_USER_BY_ID } from "../graphql/queries";
import Loading from "./ui/Loading";
import IndividualContactCard from "./IndividualContactCard/IndividualContactCard";
import IndividualContactCardOptions from "./IndividualContactCard/IndividualContactCardOptions";

const Contact = ({ user, setActiveMenuItem, menuComponent }) => {
  const navigate = useNavigate();

  const [isBlocked, setIsBlocked] = useState(null);
  const [haveContactBlockedYou, setHaveContactBlockedYou] = useState(null);

  const match = useMatch("/contacts/:contactId").params;
  const { data, loading } = useQuery(FIND_USER_BY_ID, {
    variables: {
      id: match.contactId,
    },
  });

  useEffect(() => {
    setActiveMenuItem("contacts");
  }, [setActiveMenuItem]);

  useEffect(() => {
    if (data) {
      setIsBlocked(
        user.blockedContacts.find((user) => user.id === data.findUserById.id)
      );
      setHaveContactBlockedYou(
        data.findUserById.blockedContacts.find(
          (contact) => contact.id === user.id
        )
      );
    }
  }, [data, user.blockedContacts, user.id]);

  const goBack = () => {
    navigate("/contacts");
  };

  return (
    <div
      data-testid="contact-page"
      className="flex-grow flex bg-slate-50 dark:bg-slate-700"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="flex-grow flex justify-center items-start">
        <div className="relative flex-grow max-w-[1000px] h-full p-4 lg:p-8 flex flex-col justify-start items-center">
          <div className="absolute left-8 flex justify-center items-center sm:hidden">
            <button data-testid="go-back-button" onClick={goBack}>
              <IoChevronBack className="w-6 h-6 lg:w-7 lg:h-7 text-slate-700 dark:text-slate-100 fill-current" />
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div data-testid="contact-info" className="flex-grow">
                <IndividualContactCard
                  user={user}
                  contact={data.findUserById}
                />
                {isBlocked && (
                  <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
                    <div className="text-mobile sm:text-xl text-red-600 font-bold">
                      You have blocked this contact!
                    </div>
                  </div>
                )}
                {haveContactBlockedYou && (
                  <div className="flex-grow w-full max-h-[60px] flex flex-row justify-center items-center p-2 rounded-xl">
                    <div className="text-mobile sm:text-xl text-red-600 font-bold">
                      This contact has blocked you!
                    </div>
                  </div>
                )}
              </div>
              <IndividualContactCardOptions
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
