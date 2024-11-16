import { useNavigate } from "react-router-dom";

const NewChatHeader = ({ user, chat }) => {
  const navigate = useNavigate();
  const getInfo = () => {
    if (chat.isGroupChat) {
      console.log("Clicked group chat info!");
    } else {
      console.log("Clicked private chat info!");
      const anotherChatParticipant = chat.participants.find(
        (participant) => participant.username !== user.username
      );
      navigate(`/contacts/${anotherChatParticipant.id}`);
    }
  };

  const chatParticipantsString = chat.participants
    .map((participant) =>
      participant.username === user.username ? "You" : participant.name
    )
    .join(", ");

  return (
    <div className="w-full flex justify-center items-center py-2 bg-white dark:bg-slate-800 shadow-lg">
      <div className="flex">
        <button onClick={getInfo} className="flex-grow">
          <div className="flex justify-center items-center">
            <div className="mr-4">
              <img
                className="w-16 h-16 rounded-full"
                src={chat.image}
                alt="chat-thumbnail"
              />
            </div>
            <div>
              <div className="text-base text-slate-800 dark:text-slate-100 font-bold text-left">
                {chat.title}
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {chatParticipantsString}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NewChatHeader;
