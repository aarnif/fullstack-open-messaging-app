const NewChatHeader = ({ user, chat }) => {
  const getInfo = () => {
    console.log("Clicked chat info!");
  };

  const chatParticipantsString = chat.participants
    .map((participant) =>
      participant.username === user.username ? "You" : participant.name
    )
    .join(", ");

  console.log("Chat participants string:", chatParticipantsString);

  return (
    <div className="w-full flex justify-center items-center py-2 bg-white shadow-lg">
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
              <div className="text-base text-slate-700 font-bold text-left">
                {chat.title}
              </div>
              <div className="text-sm text-slate-700">
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
