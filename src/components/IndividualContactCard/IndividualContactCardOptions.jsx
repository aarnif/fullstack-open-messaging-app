import { BLOCK_OR_UNBLOCK_CONTACT } from "../../../graphql/mutations";

import { useMutation } from "@apollo/client";

const IndividualContactOptions = ({ contact, isBlocked, setIsBlocked }) => {
  const [blockOrUnBlockContact] = useMutation(BLOCK_OR_UNBLOCK_CONTACT, {
    onError: (error) => {
      console.log("Error blocking contact mutation:");
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleBlockContact = async () => {
    console.log("Press block/unblock contact button!");

    try {
      const { data } = await blockOrUnBlockContact({
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
        onClick={handleBlockContact}
        className="mb-2 w-full max-h-[60px] p-2 flex justify-center items-center border-2 border-slate-200 bg-slate-200 rounded-xl"
      >
        {isBlocked ? (
          <div className="text-lg font-bold text-slate-700">
            Unblock Contact
          </div>
        ) : (
          <div className="text-lg font-bold text-slate-700">Block Contact</div>
        )}
      </button>
    </div>
  );
};

export default IndividualContactOptions;
