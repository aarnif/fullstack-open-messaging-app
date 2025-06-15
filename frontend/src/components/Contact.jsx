import { useState, useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMatch, useNavigate } from "react-router";

import {
  FIND_USER_BY_ID,
  FIND_CHAT_BY_MEMBERS,
  ALL_CONTACTS_BY_USER,
} from "../graphql/queries";
import { BLOCK_OR_UNBLOCK_CONTACT, REMOVE_CONTACT } from "../graphql/mutations";
import useModal from "../hooks/useModal";
import Button from "./ui/Button";
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
      className="w-full flex flex-col justify-center items-center gap-2"
    >
      <Button
        type="button"
        variant={haveContactBlockedYou ? "disabled" : "tertiary"}
        testId="chat-with-contact-button"
        text="Chat"
        onClick={handleChatWithContact}
        disabled={haveContactBlockedYou}
      />

      <Button
        type="button"
        variant="tertiary"
        testId="block-or-unblock-contact-button"
        text={isBlocked ? "Unblock Contact" : "Block Contact"}
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
      />

      <Button
        type="button"
        variant="tertiary"
        testId="remove-contact-button"
        text="Remove Contact"
        onClick={() =>
          modal(
            "danger",
            "Remove Contact",
            `Are you sure you want to remove ${contact.name} from your contacts?`,
            "Remove",
            handleRemoveContact
          )
        }
      />
    </div>
  );
};

const Contact = ({ user, setActiveMenuItem, menuComponent }) => {
  const navigate = useNavigate();
  const { modal } = useModal();

  const [isBlocked, setIsBlocked] = useState(null);
  const [haveContactBlockedYou, setHaveContactBlockedYou] = useState(null);

  const match = useMatch("/contacts/:contactId").params;
  const { data, loading } = useQuery(FIND_USER_BY_ID, {
    variables: {
      id: match.contactId,
    },
  });

  const contact = data?.findUserById;

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
      data-testid="contact-page"
      className="flex-grow flex bg-slate-50 dark:bg-slate-700"
    >
      <div className="hidden flex-grow lg:max-w-[450px] lg:flex">
        {menuComponent}
      </div>
      <div className="p-4 flex-grow flex justify-center items-start">
        <div className="w-full h-full max-w-[1000px] flex flex-col justify-start items-start gap-4">
          <div className="w-full flex justify-start items-center lg:hidden">
            <Button
              type="button"
              variant="return"
              testId="go-back-button"
              onClick={goBack}
            />
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div
              data-testid="contact-info"
              className="w-full flex-grow flex flex-col justify-center items-center gap-4"
            >
              <div className="w-full flex-grow flex flex-col gap-4">
                <IndividualContactCard
                  user={user}
                  contact={data.findUserById}
                />

                {isBlocked && (
                  <p className="w-full text-center text-mobile sm:text-base text-red-600 font-bold">
                    You have blocked this contact!
                  </p>
                )}
                {haveContactBlockedYou && (
                  <p className="w-full text-center text-mobile sm:text-base text-red-600 font-bold">
                    This contact has blocked you!
                  </p>
                )}
              </div>

              <div
                data-testid="individual-contact-card-options"
                className="w-full flex flex-col justify-center items-center gap-2"
              >
                <Button
                  type="button"
                  variant={haveContactBlockedYou ? "disabled" : "tertiary"}
                  testId="chat-with-contact-button"
                  text="Chat"
                  onClick={handleChatWithContact}
                  disabled={haveContactBlockedYou}
                />

                <Button
                  type="button"
                  variant="tertiary"
                  testId="block-or-unblock-contact-button"
                  text={isBlocked ? "Unblock Contact" : "Block Contact"}
                  onClick={() =>
                    modal(
                      isBlocked ? "success" : "danger",
                      isBlocked ? "Unblock Contact" : "Block Contact",
                      `Are you sure you want to ${
                        isBlocked ? "unblock" : "block"
                      } ${contact.name}?`,
                      isBlocked ? "Unblock" : "Block",
                      handleBlockContact
                    )
                  }
                />

                <Button
                  type="button"
                  variant="tertiary"
                  testId="remove-contact-button"
                  text="Remove Contact"
                  onClick={() =>
                    modal(
                      "danger",
                      "Remove Contact",
                      `Are you sure you want to remove ${contact.name} from your contacts?`,
                      "Remove",
                      handleRemoveContact
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
