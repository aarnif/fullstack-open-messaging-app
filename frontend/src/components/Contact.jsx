import { useState, useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMatch, useNavigate } from "react-router";
import { IoChevronBack } from "react-icons/io5";

import {
  FIND_USER_BY_ID,
  FIND_CHAT_BY_MEMBERS,
  ALL_CONTACTS_BY_USER,
} from "../graphql/queries";
import { BLOCK_OR_UNBLOCK_CONTACT, REMOVE_CONTACT } from "../graphql/mutations";
import useModal from "../hooks/useModal";
import Loading from "./ui/Loading";
import IndividualContactCard from "./ui/IndividualContactCard";

export const IndividualContactCardOptions = ({
  user,
  contact,
  isBlocked,
  setIsBlocked,
  haveContactBlockedYou,
}) => {
  const { modal } = useModal();
  const navigate = useNavigate();

  const [findChatByMembers] = useLazyQuery(FIND_CHAT_BY_MEMBERS);

  const [blockOrUnblockContact] = useMutation(BLOCK_OR_UNBLOCK_CONTACT, {
    onError: (error) => {
      console.log("Error blocking contact mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const [removeContact] = useMutation(REMOVE_CONTACT, {
    onError: (error) => {
      console.log("Error removing contact mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleChatWithContact = async () => {
    console.log("Press chat with contact button!");

    const checkIfChatExists = await findChatByMembers({
      variables: {
        members: [user.id, contact.id],
      },
    });

    if (checkIfChatExists.data?.findChatByMembers) {
      console.log("Navigating to existing chat with contact:", contact.name);
      navigate(`/chats/${checkIfChatExists.data.findChatByMembers.id}`);
      return;
    }

    const newPrivateChatInfo = {
      title: contact.name,
      description: "",
      members: [user, contact],
      image: contact.image.thumbnail,
    };

    localStorage.setItem("new-chat-info", JSON.stringify(newPrivateChatInfo));
    navigate("/chats/new");
  };

  const handleBlockContact = async () => {
    console.log("Press block/unblock contact button!");

    try {
      const { data } = await blockOrUnblockContact({
        variables: {
          contactId: contact.id,
        },
      });

      const isContactBlocked = data.blockOrUnBlockContact;

      if (isContactBlocked) {
        console.log("Blocked contact:", contact.name);
      } else {
        console.log("Unblocked contact:", contact.name);
      }
      setIsBlocked(isContactBlocked);
    } catch (error) {
      console.log("Error blocking contact:", error);
      console.log(error.message);
    }
  };

  const handleRemoveContact = async () => {
    console.log("Removing contact...");
    try {
      await removeContact({
        variables: {
          contactId: contact.id,
        },
        refetchQueries: [
          {
            query: ALL_CONTACTS_BY_USER,
            variables: {
              searchByName: "",
            },
          },
        ],
      });

      console.log("Removed contact:", contact.name);
      navigate("/contacts");
    } catch (error) {
      console.log("Error removing contact:", error);
      console.log(error.message);
    }
  };

  return (
    <div
      data-testid="individual-contact-card-options"
      className="w-full p-4 flex flex-col justify-center items-center"
    >
      <button
        data-testid="chat-with-contact-button"
        disabled={haveContactBlockedYou}
        onClick={handleChatWithContact}
        className={
          haveContactBlockedYou
            ? "mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 \
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 \
        rounded-xl transition"
            : "mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 \
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 \
        active:scale-95 rounded-xl transition"
        }
      >
        <div
          className={
            haveContactBlockedYou
              ? "text-mobile sm:text-lg font-bold text-slate-400 dark:text-slate-500"
              : "text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100"
          }
        >
          Chat
        </div>
      </button>
      <button
        data-testid="block-or-unblock-contact-button"
        onClick={() =>
          modal(
            isBlocked ? "success" : "danger",
            isBlocked ? "Unblock Contact" : "Block Contact",
            `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${
              contact.name
            }?`,
            isBlocked ? "Unblock" : "Block",
            handleBlockContact
          )
        }
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100 border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
      >
        {isBlocked ? "Unblock Contact" : "Block Contact"}
      </button>
      <button
        data-testid="remove-contact-button"
        onClick={() =>
          modal(
            "danger",
            "Remove Contact",
            `Are you sure you want to remove ${contact.name} from your contacts?`,
            "Remove",
            handleRemoveContact
          )
        }
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100 border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
      >
        Remove Contact
      </button>
    </div>
  );
};

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
