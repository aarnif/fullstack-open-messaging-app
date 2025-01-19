import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import {
  FIND_CHAT_BY_MEMBERS,
  ALL_CONTACTS_BY_USER,
} from "../../graphql/queries";
import {
  BLOCK_OR_UNBLOCK_CONTACT,
  REMOVE_CONTACT,
} from "../../graphql/mutations";
import useConfirmModal from "../../hooks/useConfirmModal";

const IndividualContactOptions = ({
  user,
  contact,
  isBlocked,
  setIsBlocked,
  haveContactBlockedYou,
}) => {
  const { confirmModal } = useConfirmModal();
  const navigate = useNavigate();

  const [getChatByMembers] = useLazyQuery(FIND_CHAT_BY_MEMBERS);

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

    const checkIfChatExists = await getChatByMembers({
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
      const { data } = await removeContact({
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

      console.log("Removed contact:", data);
      navigate("/contacts");
    } catch (error) {
      console.log("Error removing contact:", error);
      console.log(error.message);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col justify-center items-center">
      <button
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
          confirmModal(
            `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${
              contact.name
            }?`,
            handleBlockContact
          )
        }
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
      >
        <div className="text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          {isBlocked ? "Unblock Contact" : "Block Contact"}
        </div>
      </button>
      <button
        data-testid="remove-contact-button"
        onClick={() =>
          confirmModal(
            `Are you sure you want to remove ${contact.name} from your contacts?`,
            handleRemoveContact
          )
        }
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 
        border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900 hover:border-slate-300 hover:dark:border-slate-900 
        active:scale-95 rounded-xl transition"
      >
        <div className="text-mobile sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          Remove Contact
        </div>
      </button>
    </div>
  );
};

export default IndividualContactOptions;
