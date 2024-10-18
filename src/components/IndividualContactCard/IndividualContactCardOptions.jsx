import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import {
  GET_CHAT_BY_PARTICIPANTS,
  CHECK_IF_USER_HAS_BLOCKED_YOU,
} from "../../../graphql/queries";
import { BLOCK_OR_UNBLOCK_CONTACT } from "../../../graphql/mutations";

const IndividualContactOptions = ({
  user,
  contact,
  isBlocked,
  setIsBlocked,
}) => {
  const navigate = useNavigate();

  const [getChatByParticipants] = useLazyQuery(GET_CHAT_BY_PARTICIPANTS);

  const [checkIfUserHasBlockedYou] = useLazyQuery(
    CHECK_IF_USER_HAS_BLOCKED_YOU
  );

  const [mutate] = useMutation(BLOCK_OR_UNBLOCK_CONTACT, {
    onError: (error) => {
      console.log("Error blocking contact mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleChatWithContact = async () => {
    console.log("Press chat with contact button!");

    const checkIfChatExists = await getChatByParticipants({
      variables: {
        participants: [user.id, contact.id],
      },
    });

    console.log("Check if chat exists:", checkIfChatExists);

    if (checkIfChatExists.data?.findChatByParticipants) {
      navigate(`/chats/${checkIfChatExists.data.findChatByParticipants.id}`);
      return;
    }

    const checkIfContactHasBlockedYou = await checkIfUserHasBlockedYou({
      variables: {
        userId: contact.id,
      },
    });

    if (checkIfContactHasBlockedYou.data?.checkIfUserHasBlockedYou) {
      console.log("This user has blocked you!");
      return;
    }

    const newPrivateChatInfo = {
      title: contact.name,
      description: "",
      participants: [user, contact],
      image: contact.image.thumbnail,
    };

    localStorage.setItem("new-chat-info", JSON.stringify(newPrivateChatInfo));
    navigate("/chats/new");
  };

  const handleBlockContact = async () => {
    console.log("Press block/unblock contact button!");

    try {
      const { data } = await mutate({
        variables: {
          contactId: contact.id,
        },
      });

      const isContactBlocked = data.blockOrUnBlockContact;

      if (isContactBlocked) {
        console.log("Blocked contact:", contact.id);
      } else {
        console.log("Unblocked contact:", contact.id);
      }
      setIsBlocked(isContactBlocked);
    } catch (error) {
      console.log("Error blocking contact:", error);
      console.log(error.message);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col justify-end items-start">
      <button
        onClick={handleChatWithContact}
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
      >
        <div className="text-lg font-bold text-slate-700">Chat</div>
      </button>
      <button
        onClick={handleBlockContact}
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
      >
        <div className="text-lg font-bold text-slate-700">
          {isBlocked ? "Unblock Contact" : "Block Contact"}
        </div>
      </button>
    </div>
  );
};

export default IndividualContactOptions;
